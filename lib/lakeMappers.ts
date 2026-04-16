import { lakes as staticLakes } from "@/data/landingData";
import { Lake as ApiLake } from "@/redux/services/lakesApi";
import { LakeCard } from "@/types/landingData.types";

export interface LakeViewModel extends LakeCard {
  _id?: string;
  slug?: string;
  favouriteCount?: number;
  ratingCount?: number;
  topTechniques: string[];
}

const uniq = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

const computeTopTechniques = (patterns?: ApiLake["seasonalPatterns"]): string[] => {
  const collected =
    patterns?.flatMap((pattern) => pattern.techniques || [])?.map((item) => item.trim()) || [];
  return uniq(collected).slice(0, 8);
};

export const mapApiLakeToView = (lake: ApiLake): LakeViewModel => ({
  _id: lake._id,
  id: lake.slug || lake._id,
  slug: lake.slug,
  name: lake.name,
  state: lake.state,
  rating: lake.rating || 0,
  temp: lake.conditions?.temp || "N/A",
  weather: lake.conditions?.weather || "N/A",
  wind: lake.conditions?.wind || "N/A",
  species: lake.species || [],
  image: lake.image || "/images/lake1.jpg",
  color: lake.color || "from-cyan-700/80 to-sky-900/80",
  size: lake.size || 0,
  catchRate: lake.catchRate || 0,
  recordBass: lake.recordBass || 0,
  description: lake.description || "No description available.",
  condition: (lake.conditions?.condition as LakeCard["condition"]) || "Good",
  clarity: (lake.conditions?.clarity as LakeCard["clarity"]) || "Clear",
  isFavourite: Boolean(lake.isFavourite),
  reviewCount: lake.reviewCount || lake.ratingCount || 0,
  reportCount: lake.reportCount || 0,
  nearestCity: lake.nearestCity || "",
  bestSeason: lake.bestSeason || "",
  maxDepth: lake.maxDepth || 0,
  avgDepth: lake.avgDepth || 0,
  favouriteCount: lake.favouriteCount || 0,
  ratingCount: lake.ratingCount || 0,
  topTechniques: lake.topTechniques?.length ? lake.topTechniques : computeTopTechniques(lake.seasonalPatterns),
});

export const mapStaticLakeToView = (lake: LakeCard): LakeViewModel => ({
  ...lake,
  _id: undefined,
  slug: lake.id,
  topTechniques: ["Topwater", "Swim Jig", "Crankbait", "Texas Rig"],
});

export const getFallbackLakeByIdOrSlug = (idOrSlug: string): LakeViewModel | null => {
  const match = staticLakes.find((lake) => lake.id === idOrSlug);
  return match ? mapStaticLakeToView(match) : null;
};

export const getFallbackLakes = (): LakeViewModel[] =>
  staticLakes.map(mapStaticLakeToView);
