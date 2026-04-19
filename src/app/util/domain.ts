import { BasicCompetition } from "@src/app/model/competition";
import { isDefined } from "./common";
import { CompetitionId } from "./domain-types";

export function getPersonName(person: { firstName?: string, lastName?: string }): string {
    return [person.firstName, person.lastName].filter(item => isDefined(item)).join(' ');
}

export function getDisplayName(firstName: string | undefined, lastName: string | undefined): string {
    return [firstName, lastName].filter(item => isDefined(item)).join(' ');
}

export function getOrderedCompetitionIds(competitionIdsToOrder: Array<CompetitionId>, orderedCompetitions: Array<BasicCompetition>): Array<CompetitionId> {
    if (competitionIdsToOrder.length === 0) {
      return [];
    }

    if (orderedCompetitions.length === 0) {
      console.warn(`Received empty ordered competitions`);
      return competitionIdsToOrder;
    }

    const orderedCompetitionsResult: Array<CompetitionId> = [];
    for (const competition of orderedCompetitions) {
      if (competitionIdsToOrder.includes(competition.id)) {
        orderedCompetitionsResult.push(competition.id);
      }
    }
    return orderedCompetitionsResult;
  }