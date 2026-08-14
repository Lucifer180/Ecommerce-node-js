import { CreditCard02, Package, Truck01 } from "@untitledui/icons";

import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

const values = [
    { icon: Truck01, title: "Free delivery over ₹999", description: "Dispatched within one working day, tracked all the way to your door." },
    { icon: CreditCard02, title: "Secure payments", description: "Card, UPI, and netbanking handled by Razorpay. We never see your details." },
    { icon: Package, title: "30-day returns", description: "Changed your mind? Send it back within 30 days for a full refund." },
];

export const ValueProps = () => (
    <section className="border-b border-secondary bg-secondary">
        <div className="mx-auto grid w-full max-w-container grid-cols-1 gap-10 px-4 py-16 md:grid-cols-3 md:px-8">
            {values.map(({ icon, title, description }) => (
                <div key={title} className="flex flex-col items-start gap-4">
                    <FeaturedIcon icon={icon} size="lg" color="brand" theme="light" />
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold text-primary">{title}</h3>
                        <p className="text-md text-tertiary">{description}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
);
