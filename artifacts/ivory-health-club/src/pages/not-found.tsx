import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { AnimatedPageHero } from '@/components/layout/animated-page-hero';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatedPageHero
        eyebrow="Ivory Health Club"
        title="Page Not Found"
        description="The page you are looking for may have moved. Return to the home page and continue exploring Ivory."
        compact
      >
        <Link href="/">
          <Button className="bg-primary text-secondary hover:bg-white hover:text-secondary uppercase tracking-wider font-bold rounded-full px-8 h-12">
            Return Home
          </Button>
        </Link>
      </AnimatedPageHero>
    </div>
  );
}
