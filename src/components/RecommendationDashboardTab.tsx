import { checkUserOwnerShip } from "@/lib/auth/checkUserOwnership"
import Recommendations from "./Recommendations"

type RecommendationPageProps = {
  params: { playlist_id: string }
}

const RecommendationDashboardTab: React.FC<RecommendationPageProps> = async ({
  params
}) => {
  const { playlist_id } = params
  const isOwned = await checkUserOwnerShip(playlist_id)
  return <Recommendations isOwned={isOwned} playlist_id={playlist_id} />
}

export default RecommendationDashboardTab
