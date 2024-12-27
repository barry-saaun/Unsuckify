import { convertModifiedDataToString } from "@/lib/utils"

type RecommendationTabProps = {
  modifiedData: Record<string, string | undefined>[]
}

const RecommendationDashboardTab = ({
  modifiedData
}: RecommendationTabProps) => {
  const TracksStringArray = convertModifiedDataToString(modifiedData)

  return <div>{JSON.stringify(TracksStringArray)}</div>
}

export default RecommendationDashboardTab
