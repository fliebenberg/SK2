export interface Organization {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  sportTypes: string[];
  shortName?: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  organizationId: string;
}

export interface Team {
  id: string;
  name: string;
  ageGroup: string;
  sport: string;
  organizationId: string;
}

export interface Person {
  id: string;
  name: string;
  role: 'Player' | 'Coach' | 'Staff';
  teamId: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  venueId: string;
  organizationId: string;
}

export interface Game {
  id: string;
  eventId: string;
  homeTeamId: string;
  awayTeamId: string; // Could be external team name if not in system
  awayTeamName?: string; // For external teams
  startTime: string;
  status: 'Scheduled' | 'Live' | 'Finished';
  homeScore: number;
  awayScore: number;
}

export interface ScoreLog {
  id: string;
  gameId: string;
  time: string; // Game time e.g. "12:30"
  type: 'Goal' | 'Try' | 'Point' | 'Foul' | 'Other';
  playerId?: string;
  description: string;
}
