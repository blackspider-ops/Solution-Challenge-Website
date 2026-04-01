"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Who can participate in the Solution Challenge?",
    answer: "The challenge is open to students, developers, designers, and anyone passionate about using technology for social good. You can participate individually or as a team of up to 4 members.",
  },
  {
    question: "What technologies can I use?",
    answer: "You can use any technology stack of your choice. We encourage the use of modern frameworks, cloud services, and AI/ML tools. The focus is on creating impactful solutions, not specific technologies.",
  },
  {
    question: "Is there a registration fee?",
    answer: "No, participation in the Solution Challenge is completely free. We believe in making innovation accessible to everyone regardless of their financial situation.",
  },
  {
    question: "How are projects judged?",
    answer: "Projects are evaluated based on impact potential, technical implementation, user experience, scalability, and alignment with the UN Sustainable Development Goals. A panel of industry experts will review all submissions.",
  },
  {
    question: "What are the prizes?",
    answer: "Winners will receive cash prizes totaling $100,000, mentorship opportunities, cloud credits, and the chance to present their solutions to global tech leaders and investors.",
  },
  {
    question: "Can I work on an existing project?",
    answer: "Yes, you can continue developing an existing project, but you must clearly document the progress made during the challenge period. New projects are also welcome.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking for, 
            feel free to reach out to us.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/30 data-[state=open]:shadow-lg transition-all duration-300"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
