import { useEffect, useState } from "react";
import { graphQuery } from "../lib/graph";
import { useSettings } from "../config/endpoint";

const NOUN_TRAITS_QUERY = `
 query Noun($id: ID!) {
  noun(id: $id) {
    id
    seed {
      background
      body
      accessory
      head
      glasses
    }
  }
}
`;

export function useNounTraits(nounId: string | number) {
  const { graphApi } = useSettings();
  const [traits, setTraits] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nounId) return;
    setLoading(true);
    graphQuery(NOUN_TRAITS_QUERY, { id: nounId.toString() }, graphApi)
      .then((data) => setTraits(data.noun))
      .finally(() => setLoading(false));
  }, [nounId, graphApi]);

  return { traits, loading };
}