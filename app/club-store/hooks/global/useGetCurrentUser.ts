import React, { useEffect, useState } from "react";

interface CurrentUserProps {
  userId: string;
  pointBoost: number;
}
function useGetCurrentUser() {
  const [currentUser, setCurrentUser] = useState<CurrentUserProps>();

  useEffect(() => {
    setCurrentUser({
      userId: "c411b5581db24b5ba517e9eac69b54db",
      pointBoost: 1,
    });
  }, []);
  return { currentUser };
}

export default useGetCurrentUser;
