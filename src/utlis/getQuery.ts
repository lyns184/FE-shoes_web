//Ham dung de lay query 
import { useSearchParams } from "react-router-dom";

export function getSearchQuery(key: string) {
    const [searchParams] = useSearchParams();
    return searchParams.get(key);
  }