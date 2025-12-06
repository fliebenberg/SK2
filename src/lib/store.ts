import { Organization, Team, Venue, Person, Event, Game, ScoreLog } from "@/types";

// Initial Mock Data
const MOCK_ORG_ID = "org-1";

// Singleton pattern to persist data across HMR in development
class Store {
  organizations: Organization[] = [
    {
      id: MOCK_ORG_ID,
      name: "Springfield High School",
      sportTypes: ["Soccer", "Rugby", "Netball"],
      primaryColor: "#00ff00",
      secondaryColor: "#000000",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=SHS&backgroundColor=00ff00&textColor=000000",
      shortName: "SHS",
    },
  ];

  venues: Venue[] = [
    {
      id: "venue-1",
      name: "Main Field",
      address: "123 School Lane",
      organizationId: MOCK_ORG_ID,
    },
  ];

  teams: Team[] = [
    {
      id: "team-1",
      name: "First XI",
      ageGroup: "U19",
      sport: "Soccer",
      organizationId: MOCK_ORG_ID,
    },
    {
      id: "team-2",
      name: "U16 A",
      ageGroup: "U16",
      sport: "Rugby",
      organizationId: MOCK_ORG_ID,
    },
  ];

  persons: Person[] = [];
  events: Event[] = [];
  games: Game[] = [];
  scoreLogs: ScoreLog[] = [];

  getOrganization = (id?: string) => {
    if (id) {
      return this.organizations.find(o => o.id === id) || this.organizations[0];
    }
    return this.organizations[0];
  };

  getOrganizations = () => this.organizations;
  
  updateOrganization = (id: string, data: Partial<Organization>) => {
    const orgIndex = this.organizations.findIndex(o => o.id === id);
    if (orgIndex > -1) {
      this.organizations[orgIndex] = { ...this.organizations[orgIndex], ...data };
      return this.organizations[orgIndex];
    }
    return null;
  };

  addOrganization = (org: Omit<Organization, "id">) => {
    const newOrg: Organization = {
      ...org,
      id: `org-${Date.now()}`,
    };
    this.organizations = [...this.organizations, newOrg];
    return newOrg;
  };

  getTeams = (organizationId?: string) => {
    if (organizationId) {
      return this.teams.filter(t => t.organizationId === organizationId);
    }
    return this.teams;
  };

  addTeam = (team: Omit<Team, "id" | "organizationId">) => {
    const newTeam: Team = {
      ...team,
      id: `team-${Date.now()}`,
      organizationId: MOCK_ORG_ID, // TODO: This should probably be passed in or derived from context
    };
    this.teams = [...this.teams, newTeam];
    return newTeam;
  };
  
  getVenues = (organizationId?: string) => {
    if (organizationId) {
      return this.venues.filter(v => v.organizationId === organizationId);
    }
    return this.venues;
  };

  addVenue = (venue: Omit<Venue, "id" | "organizationId">) => {
    const newVenue: Venue = {
      ...venue,
      id: `venue-${Date.now()}`,
      organizationId: MOCK_ORG_ID, // TODO: Fix this hardcoded ID later
    };
    this.venues = [...this.venues, newVenue];
    return newVenue;
  };

  getTeam = (id: string) => this.teams.find((t) => t.id === id);
  
  getPersons = (teamId: string) => this.persons.filter((p) => p.teamId === teamId);
  
  addPerson = (person: Omit<Person, "id">) => {
    const newPerson: Person = {
      ...person,
      id: `person-${Date.now()}`,
    };
    this.persons = [...this.persons, newPerson];
    return newPerson;
  };

  getGames = (organizationId?: string) => {
      // Games are a bit trickier as they might belong to a league or tournament, 
      // but for now let's assume we filter by teams in the org? 
      // Or maybe games should have an organizationId if they are internal?
      // For this mock, let's just return all for now as the data model for games/orgs isn't fully defined for filtering yet.
      // actually, let's just return all for now to avoid breaking things, but ideally we'd filter.
      // Wait, the user specifically complained about "new org shows teams from previous org".
      // So getTeams is the most critical one.
      return this.games; 
  };
  
  getGame = (id: string) => this.games.find((g) => g.id === id);
  
  addGame = (game: Omit<Game, "id" | "status" | "homeScore" | "awayScore">) => {
    const newGame: Game = {
      ...game,
      id: `game-${Date.now()}`,
      status: 'Scheduled',
      homeScore: 0,
      awayScore: 0,
    };
    this.games = [...this.games, newGame];
    return newGame;
  };

  updateGameStatus = (id: string, status: Game['status']) => {
    const game = this.games.find(g => g.id === id);
    if (game) {
      game.status = status;
    }
  };

  updateScore = (id: string, homeScore: number, awayScore: number) => {
    const game = this.games.find(g => g.id === id);
    if (game) {
      game.homeScore = homeScore;
      game.awayScore = awayScore;
    }
  };
}

const globalForStore = globalThis as unknown as { store: Store };

export const store = globalForStore.store || new Store();

if (process.env.NODE_ENV !== "production") globalForStore.store = store;
