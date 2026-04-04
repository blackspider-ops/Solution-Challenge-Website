"use client"

import { motion } from "framer-motion"
import { Mail, MessageCircle } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

const faqs = [
  {
    question: "Who can participate in the Solution Challenge?",
    answer: "The challenge is open to Penn State students of all majors and skill levels. You can participate individually or as a team of up to 4 members. No prior hackathon experience is required.",
  },
  {
    question: "When and where does the event take place?",
    answer: "The Solution Challenge runs from April 11 at 7:00 PM through April 12 at 12:00 PM — a 17-hour hackathon. It is held at the ECoRE Building, University Park, PA.",
  },
  {
    question: "What technologies can I use?",
    answer: "You can use any technology stack of your choice. We encourage the use of modern frameworks, cloud services, and AI/ML tools. The focus is on creating impactful solutions, not specific technologies.",
  },
  {
    question: "Is there a registration fee?",
    answer: "No, participation in the Solution Challenge is completely free. We believe in making innovation accessible to everyone.",
  },
  {
    question: "How are projects judged?",
    answer: "Projects are evaluated based on impact potential, technical implementation, user experience, scalability, and alignment with the UN Sustainable Development Goals. A panel of expert judges will review all submissions.",
  },
  {
    question: "What do winners receive?",
    answer: "Winning teams advance to the North America regional round of the Google Solution Challenge, held by Google. This is a prestigious opportunity to compete at a global level and gain recognition from the Google Developer community.",
  },
  {
    question: "When does team formation happen?",
    answer: "Team formation for new participants happens at 8:00 PM on April 11 — one hour after the event kickoff. At that same time, the challenge prompts are released and hacking officially begins.",
  },
  {
    question: "When is the submission deadline?",
    answer: "All project submissions must be completed by 10:00 AM on April 12 — two hours before judging begins at 12:00 PM. Late submissions will not be accepted.",
  },
  {
    question: "Can I work on an existing project?",
    answer: "Yes, you can continue developing an existing project, but you must clearly document the progress made during the hackathon period. New projects are also welcome.",
  },
  {
    question: "How do I contact the organizers?",
    answer: "Email us at gdg@psu.edu for any questions about the event, sponsorship opportunities, or general inquiries. We'll get back to you as soon as possible.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-muted/50" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
          >
            Got Questions?
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to know about the Solution Challenge.
            Can&apos;t find your answer? Reach out to our team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="group bg-card border-2 border-border rounded-2xl px-6 overflow-hidden data-[state=open]:border-primary/30 data-[state=open]:shadow-xl data-[state=open]:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-6 text-base font-medium [&[data-state=open]]:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center p-10 rounded-3xl bg-gradient-to-br from-primary/5 via-card to-chart-2/5 border-2 border-border/50">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Our team is here to help. Email us and we&apos;ll get back to you as soon as possible.
            </p>
            <Button
              className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-105 transition-all duration-300 group rounded-xl px-6"
              asChild
            >
              <a href="#contact">
                <Mail className="mr-2 w-4 h-4" />
                Contact Us
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
