import React from "react";
import StatCard from "./StatCard";

const StatsGrid = ({ children, stats, columns = 4 }) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={`grid ${gridCols[columns]} rounded-md gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 stagger-children`}
    >
      {stats
        ? stats.map((stat, index) => <StatCard key={index} {...stat} />)
        : children}
    </div>
  );
};

export default StatsGrid;
