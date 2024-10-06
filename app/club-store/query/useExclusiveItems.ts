import { useQuery } from "@tanstack/react-query";

type Post = {
  id: number;
  title: string;
  body: string;
};

const fetchExclusiveItems = async (): Promise<Array<Post>> => {
  const response = await fetch(
    "https://dev-api.wwechampions.com/club/offers/all"
  );
  return await response.json();
};

const useExclusiveItems = () => {
  return useQuery({
    queryKey: ["useExclusiveItems"],
    queryFn: () => fetchExclusiveItems(),
  });
};

export default useExclusiveItems;
