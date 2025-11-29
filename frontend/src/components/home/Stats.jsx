// ============================================
// FILE: src/components/home/Stats.jsx
// ============================================
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      icon: Users,
      value: '2000+',
      label: 'Students Trained',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
    {
      icon: BookOpen,
      value: '12+',
      label: 'Expert Courses',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100 dark:bg-secondary-900/30',
    },
    {
      icon: Award,
      value: '95%',
      label: 'Success Rate',
      color: 'text-accent-600',
      bgColor: 'bg-accent-100 dark:bg-accent-900/30',
    },
    {
      icon: TrendingUp,
      value: '500+',
      label: 'Job Placements',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center space-y-3 p-6 rounded-xl bg-card border hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 mx-auto rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;