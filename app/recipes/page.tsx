"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock, Users, Flame, ChefHat, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";
import { Badge } from "@/components/ui/badge";
import { recipes, recipeCategories } from "@/lib/recipes";
import { cn } from "@/lib/utils";

const difficultyColors = {
  Easy: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
  Medium: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
  Hard: "bg-[var(--color-error)]/10 text-[var(--color-error)]",
};

export default function RecipesPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof recipeCategories)[number]>("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return recipes;
    return recipes.filter((r) => r.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        eyebrow="Recipes"
        title="Cook With Mushrooms"
        description="Simple, delicious recipes to make the most of your fresh mushrooms. From quick weeknight meals to impressive dinner party dishes."
        image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {recipeCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-semibold transition-colors border",
                  activeCategory === category
                    ? "bg-primary text-white border-primary"
                    : "bg-secondary text-secondary-foreground border-border hover:border-primary hover:text-primary"
                )}
              >
                {category}
              </button>
            ))}
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((recipe, i) => (
              <FadeIn key={recipe.id} delay={(i % 3) * 0.08}>
                <Link href={`/recipes/${recipe.slug}`} className="group block">
                  <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-52 overflow-hidden">
                      <SafeImage
                        src={recipe.image}
                        alt={recipe.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className={difficultyColors[recipe.difficulty]}>{recipe.difficulty}</Badge>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <Badge className="bg-card/90 backdrop-blur-sm text-foreground">{recipe.mushroomType}</Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{recipe.category}</span>
                      <h3 className="font-bold text-lg text-foreground font-heading mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-[var(--color-body)] line-clamp-2 mb-4">{recipe.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock size={13} /> {recipe.prepTime} + {recipe.cookTime}</span>
                        <span className="flex items-center gap-1"><Users size={13} /> {recipe.servings} servings</span>
                        <span className="flex items-center gap-1"><Flame size={13} /> {recipe.calories} cal</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">No recipes found in this category.</div>
          )}

          <FadeIn className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-secondary rounded-2xl px-6 py-4 border border-border">
              <ChefHat size={24} className="text-primary" />
              <div className="text-left">
                <p className="font-bold text-foreground text-sm">Got a mushroom recipe?</p>
                <p className="text-xs text-[var(--color-body)]">Share it with our community and get featured!</p>
              </div>
              <Link href="/contact" className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Submit <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
