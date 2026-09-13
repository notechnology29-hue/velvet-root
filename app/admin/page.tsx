"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import {
  createSupabaseBrowserClient,
  type AppProfile,
  type ProfileStatus,
  syncAuthenticatedProfile
} from "@/lib/supabase";

type StatusFilter = "all" | ProfileStatus;
type MemberFilter = "all" | "approved" | "active";
type AdminTab = "applications" | "members" | "settings";

const pageSize = 8;
const applicationStatusFilters: StatusFilter[] = [
  "pending",
  "approved",
  "active",
  "rejected",
  "all"
];
const memberStatusFilters: MemberFilter[] = ["all", "active", "approved"];

function formatFilterLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function statusBadgeClass(status: ProfileStatus) {
  if (status === "active") {
    return "border-botanical/40 bg-botanical/10 text-cream";
  }

  if (status === "rejected") {
    return "border-rose/40 bg-rose/10 text-cream";
  }

  if (status === "approved") {
    return "border-rose/30 bg-white/[0.05] text-cream";
  }

  return "border-white/10 bg-white/[0.04] text-cream/80";
}

function getProfileSearchBlob(profile: AppProfile) {
  return [
    profile.name,
    profile.email,
    profile.phone ?? "",
    profile.social_handle ?? "",
    String(profile.vetting_answers.draw ?? ""),
    String(profile.vetting_answers.community ?? "")
  ]
    .join(" ")
    .toLowerCase();
}

function paginateProfiles(profiles: AppProfile[], page: number) {
  const start = (page - 1) * pageSize;
  return profiles.slice(start, start + pageSize);
}

export default function AdminPage() {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [profiles, setProfiles] = useState<AppProfile[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [applicationStatusFilter, setApplicationStatusFilter] =
    useState<StatusFilter>("pending");
  const [memberStatusFilter, setMemberStatusFilter] = useState<MemberFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [tab, setTab] = useState<AdminTab>("applications");
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applicationPage, setApplicationPage] = useState(1);
  const [memberPage, setMemberPage] = useState(1);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;

    const hydrateAuthState = async (nextSession: Session | null) => {
      if (!active) {
        return;
      }

      setSession(nextSession);

      if (!nextSession) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const syncedProfile = await syncAuthenticatedProfile(nextSession);

        if (!active) {
          return;
        }

        setProfile(syncedProfile);
      } catch (error) {
        if (!active) {
          return;
        }

        setProfile(null);
        setMessage(error instanceof Error ? error.message : "Unable to load admin profile.");
      }

      setLoading(false);
    };

    const loadSession = async () => {
      const {
        data: { session: currentSession }
      } = await supabase.auth.getSession();

      await hydrateAuthState(currentSession);
    };

    loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      await hydrateAuthState(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !session || !profile || profile.role !== "admin") {
      return;
    }

    let active = true;

    const loadDashboard = async () => {
      const [{ data: profileRows, error: profilesError }, { data: settingRow, error: settingsError }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .neq("role", "admin")
            .order("created_at", { ascending: false }),
          supabase
            .from("settings")
            .select("value")
            .eq("key", "hero_video_url")
            .maybeSingle()
        ]);

      if (!active) {
        return;
      }

      if (profilesError) {
        setMessage(profilesError.message);
        return;
      }

      if (settingsError) {
        setMessage(settingsError.message);
        return;
      }

      setProfiles((profileRows as AppProfile[]) ?? []);
      setHeroVideoUrl(settingRow?.value ?? "");
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [profile, session, supabase]);

  const applicationCounts = useMemo(() => {
    return profiles.reduce<Record<ProfileStatus, number>>(
      (counts, currentProfile) => {
        counts[currentProfile.status] += 1;
        return counts;
      },
      {
        pending: 0,
        approved: 0,
        rejected: 0,
        active: 0
      }
    );
  }, [profiles]);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return profiles.filter((currentProfile) => {
      const matchesStatus =
        applicationStatusFilter === "all"
          ? true
          : currentProfile.status === applicationStatusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return getProfileSearchBlob(currentProfile).includes(normalizedSearch);
    });
  }, [applicationStatusFilter, profiles, searchTerm]);

  const memberProfiles = useMemo(() => {
    const normalizedSearch = memberSearchTerm.trim().toLowerCase();

    return profiles.filter((currentProfile) => {
      if (currentProfile.status !== "active" && currentProfile.status !== "approved") {
        return false;
      }

      const matchesStatus =
        memberStatusFilter === "all" ? true : currentProfile.status === memberStatusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return getProfileSearchBlob(currentProfile).includes(normalizedSearch);
    });
  }, [memberSearchTerm, memberStatusFilter, profiles]);

  const applicationPageCount = Math.max(1, Math.ceil(filteredApplications.length / pageSize));
  const memberPageCount = Math.max(1, Math.ceil(memberProfiles.length / pageSize));

  useEffect(() => {
    setApplicationPage(1);
  }, [applicationStatusFilter, searchTerm]);

  useEffect(() => {
    setMemberPage(1);
  }, [memberSearchTerm, memberStatusFilter]);

  useEffect(() => {
    if (applicationPage > applicationPageCount) {
      setApplicationPage(applicationPageCount);
    }
  }, [applicationPage, applicationPageCount]);

  useEffect(() => {
    if (memberPage > memberPageCount) {
      setMemberPage(memberPageCount);
    }
  }, [memberPage, memberPageCount]);

  const paginatedApplications = useMemo(
    () => paginateProfiles(filteredApplications, applicationPage),
    [applicationPage, filteredApplications]
  );

  const paginatedMembers = useMemo(
    () => paginateProfiles(memberProfiles, memberPage),
    [memberPage, memberProfiles]
  );

  useEffect(() => {
    if (!filteredApplications.length) {
      setSelectedApplicationId(null);
      return;
    }

    const stillVisible = filteredApplications.some(
      (currentProfile) => currentProfile.id === selectedApplicationId
    );

    if (!stillVisible) {
      setSelectedApplicationId(filteredApplications[0].id);
    }
  }, [filteredApplications, selectedApplicationId]);

  useEffect(() => {
    if (!memberProfiles.length) {
      setSelectedMemberId(null);
      return;
    }

    const stillVisible = memberProfiles.some(
      (currentProfile) => currentProfile.id === selectedMemberId
    );

    if (!stillVisible) {
      setSelectedMemberId(memberProfiles[0].id);
    }
  }, [memberProfiles, selectedMemberId]);

  useEffect(() => {
    const visibleIds =
      tab === "applications"
        ? filteredApplications.map((currentProfile) => currentProfile.id)
        : memberProfiles.map((currentProfile) => currentProfile.id);

    setSelectedIds((currentIds) =>
      currentIds.filter((currentId) => visibleIds.includes(currentId))
    );
  }, [filteredApplications, memberProfiles, tab]);

  const selectedApplication =
    filteredApplications.find((currentProfile) => currentProfile.id === selectedApplicationId) ??
    null;
  const selectedMember =
    memberProfiles.find((currentProfile) => currentProfile.id === selectedMemberId) ?? null;

  const visiblePageProfiles =
    tab === "applications" ? paginatedApplications : paginatedMembers;
  const allVisibleSelected =
    visiblePageProfiles.length > 0 &&
    visiblePageProfiles.every((currentProfile) => selectedIds.includes(currentProfile.id));

  function toggleProfileSelection(profileId: string) {
    setSelectedIds((currentIds) =>
      currentIds.includes(profileId)
        ? currentIds.filter((currentId) => currentId !== profileId)
        : [...currentIds, profileId]
    );
  }

  function toggleVisiblePageSelection() {
    const visibleIds = visiblePageProfiles.map((currentProfile) => currentProfile.id);

    setSelectedIds((currentIds) => {
      if (allVisibleSelected) {
        return currentIds.filter((currentId) => !visibleIds.includes(currentId));
      }

      return Array.from(new Set([...currentIds, ...visibleIds]));
    });
  }

  async function handleStatusUpdate(ids: string[], nextStatus: ProfileStatus) {
    if (!supabase || ids.length === 0) {
      setMessage("Select at least one member profile.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({ status: nextStatus })
      .in("id", ids);

    setSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setProfiles((currentProfiles) =>
      currentProfiles.map((currentProfile) =>
        ids.includes(currentProfile.id)
          ? { ...currentProfile, status: nextStatus }
          : currentProfile
      )
    );
    setSelectedIds((currentIds) => currentIds.filter((currentId) => !ids.includes(currentId)));
    setMessage(
      ids.length === 1
        ? nextStatus === "rejected"
          ? "Member profile denied."
          : `Profile moved to ${nextStatus}.`
        : `${ids.length} profiles moved to ${nextStatus}.`
    );
  }

  async function handleSaveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const { error } = await supabase.from("settings").upsert(
      {
        key: "hero_video_url",
        value: heroVideoUrl.trim()
      },
      { onConflict: "key" }
    );

    setSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Hero video URL saved.");
  }

  async function handleSignOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setProfiles([]);
    setSelectedApplicationId(null);
    setSelectedMemberId(null);
    setSelectedIds([]);
    setMessage(null);
  }

  if (!supabase) {
    return (
      <div className="section-shell flex min-h-[100dvh] items-center justify-center">
        <div className="surface-card w-full max-w-md p-6 text-center">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-4 text-3xl">Supabase is not configured</h1>
          <p className="mt-4 text-base text-cream/80">
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable
            admin access.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="section-shell flex min-h-[100dvh] items-center justify-center">
        <div className="surface-card w-full max-w-md p-6 text-center">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-4 text-3xl">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="section-shell flex min-h-[100dvh] items-center justify-center">
        <div className="surface-card w-full max-w-md p-6 sm:p-8">
          <p className="eyebrow">Admin Panel</p>
          <h1 className="mt-4 text-3xl md:text-4xl">Staff authentication required</h1>
          <p className="mt-4 text-base text-cream/80">
            Continue to the dedicated login route to request your secure magic link.
          </p>
          <Link
            href="/admin/login"
            className="button-solid mt-6 w-full min-h-[52px] rounded-2xl"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== "admin") {
    return (
      <div className="section-shell flex min-h-[100dvh] items-center justify-center">
        <div className="surface-card w-full max-w-md p-6 sm:p-8">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-4 text-3xl md:text-4xl">Access denied</h1>
          <p className="mt-4 text-base text-cream/80">
            This account does not have admin privileges.
          </p>
          <button
            onClick={handleSignOut}
            className="button-outline mt-6 w-full min-h-[52px] rounded-2xl"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h1 className="mt-3 text-3xl md:text-4xl">Membership operations</h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base">
            Review applicants, batch-update statuses, and manage approved or active
            members from a mobile-first control surface.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/login"
            className="button-outline min-h-[44px] rounded-full px-4 text-xs"
          >
            Login Route
          </Link>
          <button
            onClick={handleSignOut}
            className="button-outline min-h-[44px] rounded-full px-4 text-xs"
          >
            Sign out
          </button>
        </div>
      </div>

      {message ? (
        <div className="mt-6 rounded-2xl border border-botanical/35 bg-botanical/10 px-4 py-3 text-sm text-cream/85">
          {message}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cream/50">Pending</p>
          <p className="mt-3 text-3xl text-cream">{applicationCounts.pending}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cream/50">Active</p>
          <p className="mt-3 text-3xl text-cream">{applicationCounts.active}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cream/50">Approved</p>
          <p className="mt-3 text-3xl text-cream">{applicationCounts.approved}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cream/50">Rejected</p>
          <p className="mt-3 text-3xl text-cream">{applicationCounts.rejected}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-2 rounded-full border border-white/10 bg-white/[0.02] p-1">
        <button
          type="button"
          onClick={() => setTab("applications")}
          className={`flex-1 min-h-[44px] rounded-full px-4 text-sm uppercase tracking-[0.2em] ${
            tab === "applications" ? "bg-rose/15 text-cream" : "text-cream/60"
          }`}
        >
          Applications
        </button>
        <button
          type="button"
          onClick={() => setTab("members")}
          className={`flex-1 min-h-[44px] rounded-full px-4 text-sm uppercase tracking-[0.2em] ${
            tab === "members" ? "bg-rose/15 text-cream" : "text-cream/60"
          }`}
        >
          Members
        </button>
        <button
          type="button"
          onClick={() => setTab("settings")}
          className={`flex-1 min-h-[44px] rounded-full px-4 text-sm uppercase tracking-[0.2em] ${
            tab === "settings" ? "bg-rose/15 text-cream" : "text-cream/60"
          }`}
        >
          Settings
        </button>
      </div>

      {tab === "applications" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="surface-card p-4">
              <div className="grid gap-4">
                <label className="space-y-2">
                  <span className="text-sm uppercase tracking-[0.24em] text-cream/70">
                    Search applicants
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by name, email, phone, or notes"
                    className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
                  />
                </label>

                <div className="mask-scrollbar flex gap-2 overflow-x-auto pb-1">
                  {applicationStatusFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setApplicationStatusFilter(filter)}
                      className={`min-h-[44px] whitespace-nowrap rounded-full border px-4 text-sm uppercase tracking-[0.2em] transition ${
                        applicationStatusFilter === filter
                          ? "border-rose/50 bg-rose/12 text-cream"
                          : "border-white/10 text-cream/65"
                      }`}
                    >
                      {formatFilterLabel(filter)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="surface-card p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">Bulk actions</p>
                    <p className="mt-2 text-sm text-cream/70">
                      {selectedIds.length} selected on current filtered view
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleVisiblePageSelection}
                    className="button-outline min-h-[44px] rounded-full px-4 text-xs"
                  >
                    {allVisibleSelected ? "Clear Page" : "Select Page"}
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    disabled={submitting || selectedIds.length === 0}
                    onClick={() => handleStatusUpdate(selectedIds, "active")}
                    className="min-h-[52px] rounded-2xl bg-botanical px-4 text-sm uppercase tracking-[0.2em] text-cream disabled:opacity-60"
                  >
                    Activate
                  </button>
                  <button
                    type="button"
                    disabled={submitting || selectedIds.length === 0}
                    onClick={() => handleStatusUpdate(selectedIds, "approved")}
                    className="min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.04] px-4 text-sm uppercase tracking-[0.2em] text-cream disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={submitting || selectedIds.length === 0}
                    onClick={() => handleStatusUpdate(selectedIds, "rejected")}
                    className="min-h-[52px] rounded-2xl border border-rose/50 bg-rose/10 px-4 text-sm uppercase tracking-[0.2em] text-cream disabled:opacity-60"
                  >
                    Deny
                  </button>
                </div>
              </div>
            </div>

            <div className="surface-card overflow-hidden">
              <div className="border-b border-white/10 px-4 py-4">
                <p className="eyebrow">Applicant queue</p>
                <p className="mt-2 text-sm text-cream/70">
                  Page {applicationPage} of {applicationPageCount}
                </p>
              </div>

              <div className="max-h-[70dvh] overflow-y-auto">
                {paginatedApplications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-cream/70">
                    No applicants match the current filters.
                  </div>
                ) : (
                  paginatedApplications.map((currentProfile) => {
                    const checked = selectedIds.includes(currentProfile.id);

                    return (
                      <div
                        key={currentProfile.id}
                        className={`border-b border-white/8 px-4 py-4 last:border-b-0 ${
                          selectedApplicationId === currentProfile.id
                            ? "bg-rose/10"
                            : "bg-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => toggleProfileSelection(currentProfile.id)}
                            className={`mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                              checked
                                ? "border-rose/60 bg-rose/20 text-cream"
                                : "border-white/15 text-transparent"
                            }`}
                            aria-label={`Select ${currentProfile.name}`}
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedApplicationId(currentProfile.id)}
                            className="min-h-[44px] flex-1 text-left"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-base font-medium text-cream">
                                  {currentProfile.name}
                                </p>
                                <p className="truncate text-sm text-cream/60">
                                  {currentProfile.email}
                                </p>
                              </div>
                              <span
                                className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${statusBadgeClass(
                                  currentProfile.status
                                )}`}
                              >
                                {currentProfile.status}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-cream/50">
                              <span>{new Date(currentProfile.created_at).toLocaleDateString()}</span>
                              {currentProfile.phone ? <span>{currentProfile.phone}</span> : null}
                            </div>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 px-4 py-4">
                <button
                  type="button"
                  disabled={applicationPage === 1}
                  onClick={() => setApplicationPage((currentPage) => currentPage - 1)}
                  className="button-outline min-h-[44px] rounded-full px-4 text-xs disabled:opacity-50"
                >
                  Previous
                </button>
                <p className="text-sm text-cream/70">
                  {filteredApplications.length} total applicants
                </p>
                <button
                  type="button"
                  disabled={applicationPage === applicationPageCount}
                  onClick={() => setApplicationPage((currentPage) => currentPage + 1)}
                  className="button-outline min-h-[44px] rounded-full px-4 text-xs disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="surface-card p-5 lg:sticky lg:top-24 lg:self-start">
            {selectedApplication ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">Applicant Detail</p>
                    <h2 className="mt-3 text-2xl">{selectedApplication.name}</h2>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.24em] ${statusBadgeClass(
                      selectedApplication.status
                    )}`}
                  >
                    {selectedApplication.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-3 text-sm text-cream/80">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-cream/50">Email</p>
                    <p className="mt-2 break-all text-base text-cream">
                      {selectedApplication.email}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-cream/50">Phone</p>
                      <p className="mt-2 text-base text-cream">
                        {selectedApplication.phone ?? "Not provided"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-cream/50">Social</p>
                      <p className="mt-2 text-base text-cream">
                        {selectedApplication.social_handle ?? "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4 rounded-[24px] border border-white/10 bg-white/[0.02] p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-rose/80">
                      What draws you to the experience?
                    </p>
                    <p className="mt-2 text-sm text-cream/82">
                      {String(selectedApplication.vetting_answers.draw ?? "—")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-rose/80">
                      Community alignment
                    </p>
                    <p className="mt-2 text-sm text-cream/82">
                      {String(selectedApplication.vetting_answers.community ?? "—")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-rose/80">
                      Birth date
                    </p>
                    <p className="mt-2 text-sm text-cream/82">
                      {String(selectedApplication.vetting_answers.dob ?? "—")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleStatusUpdate([selectedApplication.id], "active")}
                    className="min-h-[56px] rounded-2xl bg-botanical px-5 text-sm uppercase tracking-[0.2em] text-cream transition hover:brightness-110 disabled:opacity-70"
                  >
                    Approve & Activate
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleStatusUpdate([selectedApplication.id], "approved")}
                    className="min-h-[56px] rounded-2xl border border-white/12 bg-white/[0.04] px-5 text-sm uppercase tracking-[0.2em] text-cream transition hover:bg-white/[0.08] disabled:opacity-70"
                  >
                    Mark Approved
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleStatusUpdate([selectedApplication.id], "rejected")}
                    className="min-h-[56px] rounded-2xl border border-rose/50 bg-rose/10 px-5 text-sm uppercase tracking-[0.2em] text-cream transition hover:bg-rose/20 disabled:opacity-70"
                  >
                    Deny
                  </button>
                </div>
              </>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center text-center text-cream/70">
                Select an applicant to review details and update status.
              </div>
            )}
          </div>
        </div>
      ) : null}

      {tab === "members" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="surface-card p-4">
              <div className="grid gap-4">
                <label className="space-y-2">
                  <span className="text-sm uppercase tracking-[0.24em] text-cream/70">
                    Search members
                  </span>
                  <input
                    type="text"
                    value={memberSearchTerm}
                    onChange={(event) => setMemberSearchTerm(event.target.value)}
                    placeholder="Search approved and active members"
                    className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
                  />
                </label>

                <div className="mask-scrollbar flex gap-2 overflow-x-auto pb-1">
                  {memberStatusFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setMemberStatusFilter(filter)}
                      className={`min-h-[44px] whitespace-nowrap rounded-full border px-4 text-sm uppercase tracking-[0.2em] transition ${
                        memberStatusFilter === filter
                          ? "border-rose/50 bg-rose/12 text-cream"
                          : "border-white/10 text-cream/65"
                      }`}
                    >
                      {formatFilterLabel(filter)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="surface-card p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">Bulk member actions</p>
                    <p className="mt-2 text-sm text-cream/70">
                      {selectedIds.length} selected on current member view
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleVisiblePageSelection}
                    className="button-outline min-h-[44px] rounded-full px-4 text-xs"
                  >
                    {allVisibleSelected ? "Clear Page" : "Select Page"}
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    disabled={submitting || selectedIds.length === 0}
                    onClick={() => handleStatusUpdate(selectedIds, "active")}
                    className="min-h-[52px] rounded-2xl bg-botanical px-4 text-sm uppercase tracking-[0.2em] text-cream disabled:opacity-60"
                  >
                    Activate
                  </button>
                  <button
                    type="button"
                    disabled={submitting || selectedIds.length === 0}
                    onClick={() => handleStatusUpdate(selectedIds, "approved")}
                    className="min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.04] px-4 text-sm uppercase tracking-[0.2em] text-cream disabled:opacity-60"
                  >
                    Keep Approved
                  </button>
                  <button
                    type="button"
                    disabled={submitting || selectedIds.length === 0}
                    onClick={() => handleStatusUpdate(selectedIds, "rejected")}
                    className="min-h-[52px] rounded-2xl border border-rose/50 bg-rose/10 px-4 text-sm uppercase tracking-[0.2em] text-cream disabled:opacity-60"
                  >
                    Remove Access
                  </button>
                </div>
              </div>
            </div>

            <div className="surface-card overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_auto] gap-3 border-b border-white/10 px-4 py-4 text-[11px] uppercase tracking-[0.24em] text-cream/50">
                <span>Select</span>
                <span>Member</span>
                <span>Status</span>
              </div>

              <div className="max-h-[70dvh] overflow-y-auto">
                {paginatedMembers.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-cream/70">
                    No approved or active members match the current filters.
                  </div>
                ) : (
                  paginatedMembers.map((currentProfile) => {
                    const checked = selectedIds.includes(currentProfile.id);

                    return (
                      <div
                        key={currentProfile.id}
                        className={`grid grid-cols-[auto_1fr_auto] gap-3 border-b border-white/8 px-4 py-4 last:border-b-0 ${
                          selectedMemberId === currentProfile.id ? "bg-rose/10" : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleProfileSelection(currentProfile.id)}
                          className={`mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                            checked
                              ? "border-rose/60 bg-rose/20 text-cream"
                              : "border-white/15 text-transparent"
                          }`}
                          aria-label={`Select ${currentProfile.name}`}
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedMemberId(currentProfile.id)}
                          className="min-h-[44px] text-left"
                        >
                          <p className="text-base font-medium text-cream">{currentProfile.name}</p>
                          <p className="mt-1 text-sm text-cream/60">{currentProfile.email}</p>
                        </button>
                        <span
                          className={`my-auto rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${statusBadgeClass(
                            currentProfile.status
                          )}`}
                        >
                          {currentProfile.status}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 px-4 py-4">
                <button
                  type="button"
                  disabled={memberPage === 1}
                  onClick={() => setMemberPage((currentPage) => currentPage - 1)}
                  className="button-outline min-h-[44px] rounded-full px-4 text-xs disabled:opacity-50"
                >
                  Previous
                </button>
                <p className="text-sm text-cream/70">
                  Page {memberPage} of {memberPageCount}
                </p>
                <button
                  type="button"
                  disabled={memberPage === memberPageCount}
                  onClick={() => setMemberPage((currentPage) => currentPage + 1)}
                  className="button-outline min-h-[44px] rounded-full px-4 text-xs disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="surface-card p-5 lg:sticky lg:top-24 lg:self-start">
            {selectedMember ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">Member Management</p>
                    <h2 className="mt-3 text-2xl">{selectedMember.name}</h2>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.24em] ${statusBadgeClass(
                      selectedMember.status
                    )}`}
                  >
                    {selectedMember.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-cream/50">Email</p>
                    <p className="mt-2 break-all text-base text-cream">{selectedMember.email}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-cream/50">Phone</p>
                      <p className="mt-2 text-base text-cream">
                        {selectedMember.phone ?? "Not provided"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-cream/50">Social</p>
                      <p className="mt-2 text-base text-cream">
                        {selectedMember.social_handle ?? "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleStatusUpdate([selectedMember.id], "active")}
                    className="min-h-[56px] rounded-2xl bg-botanical px-5 text-sm uppercase tracking-[0.2em] text-cream disabled:opacity-70"
                  >
                    Set Active
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleStatusUpdate([selectedMember.id], "approved")}
                    className="min-h-[56px] rounded-2xl border border-white/12 bg-white/[0.04] px-5 text-sm uppercase tracking-[0.2em] text-cream disabled:opacity-70"
                  >
                    Set Approved
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleStatusUpdate([selectedMember.id], "rejected")}
                    className="min-h-[56px] rounded-2xl border border-rose/50 bg-rose/10 px-5 text-sm uppercase tracking-[0.2em] text-cream disabled:opacity-70"
                  >
                    Revoke Access
                  </button>
                </div>
              </>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center text-center text-cream/70">
                Select an approved or active member to manage access.
              </div>
            )}
          </div>
        </div>
      ) : null}

      {tab === "settings" ? (
        <div className="mt-6 surface-card p-6">
          <p className="eyebrow">Site Settings</p>
          <h2 className="mt-4 text-2xl">Hero video URL</h2>
          <p className="mt-3 max-w-2xl text-sm md:text-base">
            Point the homepage hero to a hosted MP4. This updates the Supabase
            settings row used by the public homepage.
          </p>

          <form onSubmit={handleSaveSettings} className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm uppercase tracking-[0.24em] text-cream/70">
                Hero Video URL
              </span>
              <input
                type="url"
                value={heroVideoUrl}
                onChange={(event) => setHeroVideoUrl(event.target.value)}
                placeholder="https://example.com/video.mp4"
                className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="button-solid w-full min-h-[52px] rounded-2xl disabled:opacity-70"
            >
              {submitting ? "Saving..." : "Save Setting"}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
