import React from 'react';

interface Testimonial {
    id: number;
    quote: string;
    name: string;
    exam: string;
    result: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote: "The structured approach to Engineering Mathematics helped me solve complex calculus problems with speed and accuracy.",
        name: "Arjun Mehta",
        exam: "GATE 2024",
        result: "AIR 28 (Civil Engineering)"
    },
    {
        id: 2,
        quote: "Detailed breakdown of differential equations tailored for the semester syllabus made the concepts crystal clear.",
        name: "Sanya Kapoor",
        exam: "Semester Exams",
        result: "Grade: O (Outstanding)"
    },
    {
        id: 3,
        quote: "Mathinova's probability and statistics module was crucial for my data science placement interviews.",
        name: "Rahul Nair",
        exam: "Campus Placements",
        result: "Placed at Tier-1 Tech Firm"
    },
    {
        id: 4,
        quote: "The clarity in explaining vector calculus concepts is unmatched. Highly recommended for core engineering aspirants.",
        name: "Priya Singh",
        exam: "ESE (IES) 2023",
        result: "Cleared Prelims & Mains"
    },
    {
        id: 5,
        quote: "Comprehensive coverage of linear algebra. The problem-solving sessions were directly relevant to the actual exam pattern.",
        name: "Vikram Reddy",
        exam: "GATE 2024",
        result: "AIR 145 (Mechanical)"
    },
    {
        id: 6,
        quote: "From basics to advanced applications, the course content is perfectly aligned with the university curriculum.",
        name: "Ananya Gupta",
        exam: "University Finals",
        result: "University Gold Medalist"
    }
];

const Testimonials: React.FC = () => {
    return (
        <section className="py-20 bg-bg-surface-2 border-t border-border-default">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary mb-4">
                        Proven Results
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Real outcomes from students who mastered engineering mathematics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="bg-bg-surface border border-border-default p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-start text-left h-full"
                        >
                            <div className="mb-6 flex-grow">
                                <p className="text-text-primary text-lg leading-relaxed font-medium">
                                    "{t.quote}"
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-border-default w-full">
                                <p className="text-text-primary font-bold text-base mb-1">
                                    {t.name}
                                </p>
                                <div className="flex flex-col text-sm text-text-secondary">
                                    <span className="font-medium text-brand-primary">{t.exam}</span>
                                    <span>{t.result}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
