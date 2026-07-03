import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Users, Flame, ShoppingCart } from "lucide-react";
import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { SafeImage } from "@/components/SafeImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRecipeBySlug, recipes } from "@/lib/recipes";

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) return { title: "Recipe Not Found" };
  return {
    title: `${recipe.title} — Recipes`,
    description: recipe.description,
  };
}

export default async function RecipeDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-secondary py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center gap-2 text-sm text-[var(--color-body)]">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={14} />
          <Link href="/recipes" className="hover:text-primary">Recipes</Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium line-clamp-1">{recipe.title}</span>
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <FadeIn>
            <div className="text-center mb-8">
              <Badge className="mb-3">{recipe.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">{recipe.title}</h1>
              <p className="text-[var(--color-body)] text-lg max-w-2xl mx-auto">{recipe.description}</p>
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock size={16} className="text-primary" /> {recipe.prepTime} prep + {recipe.cookTime} cook</span>
                <span className="flex items-center gap-1.5"><Users size={16} className="text-primary" /> {recipe.servings} servings</span>
                <span className="flex items-center gap-1.5"><Flame size={16} className="text-primary" /> {recipe.calories} cal · {recipe.protein} protein</span>
              </div>
            </div>

            <div className="relative h-80 md:h-[420px] rounded-2xl overflow-hidden mb-12">
              <SafeImage src={recipe.image} alt={recipe.title} fill sizes="100vw" className="object-cover" priority />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <FadeIn direction="right" className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="font-bold text-foreground font-heading mb-4">Ingredients</h2>
                  <ul className="space-y-2.5">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-body)]">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-primary/30 shrink-0" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-primary/5 rounded-2xl border border-primary/10 p-5">
                  <p className="text-sm font-semibold text-foreground mb-2">Need fresh {recipe.mushroomType} mushrooms?</p>
                  <p className="text-xs text-[var(--color-body)] mb-3">Get them delivered fresh from our farm.</p>
                  <Button asChild size="sm" className="w-full rounded-full">
                    <Link href={`/shop/${recipe.productSlug}`}>
                      <ShoppingCart size={14} className="mr-1.5" /> Buy {recipe.mushroomType} Mushrooms
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" className="lg:col-span-2">
              <h2 className="font-bold text-xl text-foreground font-heading mb-6">Instructions</h2>
              <ol className="space-y-6">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-[var(--color-body)] leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
