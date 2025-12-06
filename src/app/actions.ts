"use server";

import { store } from "@/lib/store";
import { revalidatePath } from "next/cache";
import { Organization } from "@/types";

export async function addTeamAction(formData: FormData) {
  const name = formData.get("name") as string;
  const sport = formData.get("sport") as string;
  const ageGroup = formData.get("ageGroup") as string;

  if (!name || !sport || !ageGroup) {
    throw new Error("Missing required fields");
  }

  store.addTeam({
    name,
    sport,
    ageGroup,
  });

  revalidatePath("/teams");
}

export async function addPersonAction(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as "Player" | "Coach" | "Staff";
  const teamId = formData.get("teamId") as string;

  if (!name || !role || !teamId) {
    throw new Error("Missing required fields");
  }

  store.addPerson({
    name,
    role,
    teamId,
  });

  revalidatePath(`/teams/${teamId}`);
}

export async function addVenueAction(formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;

  if (!name || !address) {
    throw new Error("Missing required fields");
  }

  store.addVenue({
    name,
    address,
  });

  revalidatePath("/venues");
}

export async function addGameAction(formData: FormData) {
  const homeTeamId = formData.get("homeTeamId") as string;
  const awayTeamId = formData.get("awayTeamId") as string;
  const venueId = formData.get("venueId") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;

  if (!homeTeamId || !awayTeamId || !venueId || !date || !time) {
    throw new Error("Missing required fields");
  }

  store.addGame({
    eventId: "event-1", // Simplified for MVP
    homeTeamId,
    awayTeamId,
    startTime: `${date}T${time}`,
  });

  revalidatePath("/admin");
}

export async function updateGameStatusAction(gameId: string, status: "Scheduled" | "Live" | "Finished") {
  store.updateGameStatus(gameId, status);
  revalidatePath(`/admin/games/${gameId}`);
  revalidatePath(`/games/${gameId}`);
}

export async function updateScoreAction(gameId: string, homeScore: number, awayScore: number) {
  store.updateScore(gameId, homeScore, awayScore);
  revalidatePath(`/admin/games/${gameId}`);
  revalidatePath(`/games/${gameId}`);
}
export async function updateOrganizationAction(id: string, data: Partial<Organization>) {
  store.updateOrganization(id, data);
  revalidatePath("/admin");
  revalidatePath(`/admin/organizations/${id}`);
}

export async function getOrganizationsAction() {
  return store.getOrganizations();
}

export async function createOrganizationAction(data: Omit<Organization, "id">) {
  const newOrg = store.addOrganization(data);
  revalidatePath("/admin");
  return newOrg;
}
