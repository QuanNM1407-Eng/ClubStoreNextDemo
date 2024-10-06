export const benefits = {
  BRONZE: [
    {
      content: (
        <>
          Recurring Bonus Pulls Across
          <br /> Best Loot Contents!
        </>
      ),
      subContent: [
        <>
          Get a bonus pull for <strong>every</strong> new Premium loot content
          launched in-game!
        </>,
      ],
      featured: true,
    },
    {
      content: (
        <>
          Superstar Acquisition Of Your
          <br /> Choice!
        </>
      ),
      subContent: [
        <>
          Unlock access to the Club Store, where you have the ongoing ability to
          obtain superstars of your choice from over{" "}
          <strong>400 options</strong>!
        </>,
      ],
      featured: false,
    },
    {
      content: "Superstar Fuse Up of Your Choice!",
      subContent: [
        <>
          Unlock access to the Club Store, where you have the ability to select
          specific rarities to fuse and upgrade <strong>any</strong> of your{" "}
          <strong>owned</strong> superstars! Enhance your roster and take your
          favorites to the top!
        </>,
      ],
      featured: false,
    },
    {
      content: "Club Member Loyalty program!",
      subContent: [
        <>
          Earn Club Store coins through the credit system, maximizing the value
          of <strong>every</strong> coin used to open Premium Loot contents!
        </>,
        "Earn XPs towards missions and receive Club Store coins upon completion, maximizing the value of every coin used to open Premium Loot contents!",
      ],
      featured: false,
    },
  ],
  SILVER: [
    {
      content: (
        <>
          Recurring Bonus Pulls Across
          <br /> Best Loot Contents!
        </>
      ),
      subContent: [
        <>
          Get a bonus pull for <strong>every</strong> new Premium loot content
          launched in-game!
        </>,
      ],
      featured: true,
    },
    {
      content: (
        <>
          Superstar Acquisition Of Your
          <br /> Choice!
        </>
      ),
      subContent: [
        <>
          Unlock access to the Club Store, where you have the ongoing ability to
          obtain superstars of your choice from over{" "}
          <strong>400 options</strong>!
        </>,
      ],
      featured: true,
    },
    {
      content: "Superstar Fuse Up of Your Choice!",
      subContent: [
        <>
          Unlock access to the Club Store, where you have the ability to select
          specific rarities to fuse and upgrade <strong>any</strong> of your{" "}
          <strong>owned</strong> superstars! Enhance your roster and take your
          favorites to the top!
        </>,
      ],
      featured: true,
    },
    {
      content: "Club Member Loyalty program!",
      subContent: [
        <>
          Earn Club Store coins through the credit system, maximizing the value
          of <strong>every</strong> coin used to open Premium Loot contents!
        </>,
        "Earn XPs towards missions and receive Club Store coins upon completion, maximizing the value of every coin used to open Premium Loot contents!",
      ],
      featured: true,
    },
  ],
};

export const moreInfoItems = {
  BRONZE: [
    {
      content: "FIRST TIME SIGN-UP REWARD!",
      subContent: [
        "25,000 Club Store Coins: Kick off your experience as a member of the Universal Champions Club, explore the Club Store, and choose an item of your choice!",
      ],
      featured: false,
    },
    {
      content: (
        <>
          RECURRING IN-GAME ACCESS TO
          <br /> EXCLUSIVE PERKS AND GAME PLAY
          <br /> BENEFITS!
        </>
      ),
      subContent: [
        "Access to Exclusive In-Game Store Offers: Enjoy special deals and items available only to VIP members.",
        "Auto Clear Tickets: Automatically clear select in-game PVE matches with guaranteed rewards.",
        "Match Win Loot Boxes: Flood the board with bonus loot boxes to earn even more rewards.",
        "Health Pack Boost: Supercharge Health Packs to heal your superstars faster!",
      ],
      featured: true,
    },
  ],
  SILVER: [
    {
      content: "FIRST TIME SIGN-UP REWARD!",
      subContent: [
        "25,000 Club Store Coins: Kick off your experience as a member of the Universal Champions Club, explore the Club Store, and choose an item of your choice!",
      ],
      featured: true,
    },
    {
      content: (
        <>
          RECURRING IN-GAME ACCESS TO
          <br /> EXCLUSIVE PERKS AND GAME PLAY
          <br /> BENEFITS!
        </>
      ),
      subContent: [
        "Access to Exclusive In-Game Store Offers: Enjoy special deals and items available only to VIP members.",
        "Auto Clear Tickets: Automatically clear select in-game PVE matches with guaranteed rewards.",
        "Match Win Loot Boxes: Flood the board with bonus loot boxes to earn even more rewards.",
        "Health Pack Boost: Supercharge Health Packs to heal your superstars faster!",
      ],
      featured: true,
    },
  ],
};

export const subscriptionData = {
  BRONZE: {
    benefits: benefits["BRONZE"],
    title: "Bonus pull for every NEW premium loot launched in-game",
    moreInfoItems: moreInfoItems.BRONZE,
  },
  SILVER: {
    benefits: benefits["SILVER"],
    title:
      "Experience the full spectrum of the Universal Champions Club benefits",
    moreInfoItems: moreInfoItems.SILVER,
  },
};

export default subscriptionData;
