import RecipeCard from "./RecipeCard";
import type { Recipe } from "@/types/recipe";

import { motion } from "framer-motion";

type Props = {
  recipes: Recipe[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
  onDelete: (id: string) => Promise<void>;
  onEdit: (recipe: Recipe) => void;
};

export default function RecipeList({
  recipes,
  openId,
  setOpenId,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => {
        const isOpen = openId === recipe.id;
        const isDimmed = openId && !isOpen;

        return (
          <motion.div
            key={recipe.id}
            layout
            animate={{
              scale: isOpen ? 1.02 : 1,
              opacity: isDimmed ? 0.4 : 1,
              filter: isDimmed ? "blur(2px)" : "blur(0px)",
            }}
            transition={{ duration: 0.25 }}
          >
            <RecipeCard
              recipe={recipe}
              isOpen={isOpen}
              setOpen={() =>
                setOpenId(isOpen ? null : recipe.id)
              }
              onDeleteAction={onDelete}
              onEditAction={onEdit}
            />
          </motion.div>
        );
      })}
    </div>
  );
}