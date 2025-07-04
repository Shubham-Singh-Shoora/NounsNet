import { useEffect, useState } from "react";
import { graphQuery } from "../lib/graph";
import { useSettings } from "../config/endpoint";

// Example GraphQL query for last 10 proposals
const PROPOSALS_GQL = `
  query Proposals($first: Int) {
    proposals(first: $first, orderBy: createdTimestamp, orderDirection: desc) {
      id
      title
      description
      status
      forVotes
      againstVotes
      abstainVotes
      proposer {
        id
      }
    }
  }
`;

export function useProposals(first = 10) {
  const { graphApi } = useSettings();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    graphQuery(PROPOSALS_GQL, { first }, graphApi)
      .then((data) => setProposals(data.proposals))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [graphApi, first]);

  return { proposals, loading, error };
}