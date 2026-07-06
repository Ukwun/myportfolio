export type VisitorFocus = "website" | "platform" | "mobile" | "growth";

export type VisitorProfile = {
  name: string;
  company: string;
  focus: VisitorFocus | "";
  activityCount: number;
  lastSeen: string;
  updatedAt: string;
};

const STORAGE_KEY = "john-solace-visitor-profile";
const ACTIVITY_KEY = "john-solace-activity-log";

const defaultProfile = (): VisitorProfile => ({
  name: "",
  company: "",
  focus: "",
  activityCount: 0,
  lastSeen: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

function isBrowser() {
  return typeof window !== "undefined";
}

export function readVisitorProfile(): VisitorProfile {
  if (!isBrowser()) return defaultProfile();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile();

    const parsed = JSON.parse(raw) as VisitorProfile;
    return {
      ...defaultProfile(),
      ...parsed,
      name: parsed.name ?? "",
      company: parsed.company ?? "",
      focus: parsed.focus ?? "",
      activityCount: parsed.activityCount ?? 0,
    };
  } catch {
    return defaultProfile();
  }
}

export function saveVisitorProfile(profile: VisitorProfile) {
  if (!isBrowser()) return profile;

  const nextProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
  return nextProfile;
}

export function updateVisitorProfile(patch: Partial<VisitorProfile>) {
  const profile = readVisitorProfile();
  const nextProfile = saveVisitorProfile({ ...profile, ...patch });
  return nextProfile;
}

export function recordVisitorActivity(event: string, detail?: string) {
  if (!isBrowser()) return readVisitorProfile();

  const profile = readVisitorProfile();
  const nextProfile = saveVisitorProfile({
    ...profile,
    activityCount: profile.activityCount + 1,
    lastSeen: new Date().toISOString(),
  });

  const activity = {
    id: `${Date.now()}`,
    event,
    detail: detail ?? "",
    timestamp: new Date().toISOString(),
  };

  const previous = window.localStorage.getItem(ACTIVITY_KEY);
  const activities = previous ? (JSON.parse(previous) as Array<typeof activity>) : [];
  activities.unshift(activity);
  window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities.slice(0, 8)));

  return nextProfile;
}

export function readVisitorActivity() {
  if (!isBrowser()) return [] as Array<{ id: string; event: string; detail: string; timestamp: string }>;

  const raw = window.localStorage.getItem(ACTIVITY_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Array<{ id: string; event: string; detail: string; timestamp: string }>;
  } catch {
    return [];
  }
}

export function getProfileHeadline(profile: VisitorProfile) {
  if (!profile.name) {
    return "A tailored launch experience is being prepared for you.";
  }

  if (profile.focus) {
    return `${profile.name}, your experience is being shaped around ${profile.focus}.`;
  }

  return `${profile.name}, we are tailoring the next step around your priorities.`;
}
