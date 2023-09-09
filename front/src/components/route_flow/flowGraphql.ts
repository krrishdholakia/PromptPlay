import { Observable, from, map } from "rxjs";
import { graphql } from "../../gql";
import { client } from "../../state/urql";
import { FlowContent } from "./flowTypes";

export const SPACE_FLOW_QUERY = graphql(`
  query SpaceFlowQuery($spaceId: UUID!) {
    result: space(id: $spaceId) {
      isReadOnly
      space {
        ...SpaceSubHeaderFragment
        id
        name
        flowContent
      }
    }
  }
`);

export const UPDATE_SPACE_FLOW_CONTENT_MUTATION = graphql(`
  mutation UpdateSpaceFlowContentMutation(
    $spaceId: ID!
    $flowContent: String!
  ) {
    updateSpace(id: $spaceId, flowContent: $flowContent) {
      id
      name
      flowContent
    }
  }
`);

export function queryFlowObservable(
  spaceId: string
): Observable<Partial<FlowContent>> {
  return from(client.query(SPACE_FLOW_QUERY, { spaceId })).pipe(
    map((result) => {
      // TODO: handle error

      const flowContentStr = result.data?.result?.space?.flowContent;

      let flowContent: Partial<FlowContent> = {};

      if (flowContentStr) {
        try {
          flowContent = JSON.parse(flowContentStr);
        } catch (e) {
          // TODO: handle parse error
          console.error(e);
        }
      }

      return flowContent;
    })
  );
}
