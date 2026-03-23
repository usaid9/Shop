import React from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Breadcrumb from '../components/Breadcrumb'
import ScrollFloat from '../components/ScrollFloat'

const team = [
  { name: 'Ahmed Raza',  role: 'Founder & CEO',        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
  { name: 'Bilal Khan',  role: 'Head of Design',        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face' },
  { name: 'Sara Malik',  role: 'Head of Operations',    img: 'https://images.unsplash.com/photo-1494790108755-2616b612b898?w=200&h=200&fit=crop&crop=face' },
]

const milestones = [
  { year: '2019', event: 'PREMIUM founded in Lahore with a vision for premium menswear' },
  { year: '2020', event: 'Launched online store — 1,000 customers in first 3 months' },
  { year: '2022', event: 'Expanded to 20+ cities across Pakistan, launched JazzCash payments' },
  { year: '2024', event: '15,000+ happy customers, 200+ products, nationwide delivery' },
  { year: '2025', event: 'Kurta & Shalwar collection launched — celebrating Pakistani heritage' },
]

const ValueIcons = {
  quality: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
  trust:   <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
  pakistan:<path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />,
  pricing: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
}

const values = [
  { key: 'quality',  title: 'Quality First',      desc: 'Every product is quality-checked before dispatch. We never compromise on material or craftsmanship.' },
  { key: 'trust',    title: 'Customer Trust',      desc: 'Easy returns, responsive support, and honest communication — your satisfaction is everything.' },
  { key: 'pakistan', title: 'Made for Pakistan',   desc: 'Designs tailored for Pakistani taste, climate, and culture — from formal to traditional heritage.' },
  { key: 'pricing',  title: 'Fair Pricing',        desc: "Premium quality doesn't mean premium prices. We keep margins fair so you get the best value." },
]

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="pt-[68px] min-h-screen">
      {/* Header */}
      <div className="py-10 px-4 sm:px-6 lg:px-8"
        style={{ borderBottom: "1px solid var(--border-default)", background: "var(--surface-cart)", boxShadow: "inset 0 1px 0 var(--inset-highlight)" }}>
        <div className="max-w-7xl mx-auto">
          <Breadcrumb />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mt-4">
            <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-2 flex items-center gap-2">
              <span className="w-5 h-px bg-accent" /> Our Story
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              <ScrollFloat scrollOffset={['start 95%', 'start 60%']}>About </ScrollFloat>
              <ScrollFloat scrollOffset={['start 93%', 'start 55%']} accentWords={['PREMIUM']}>PREMIUM</ScrollFloat>
            </h1>
            <p className="text-muted mt-3 text-sm max-w-lg">
              Born in Lahore, built for Pakistan. We believe every Pakistani man deserves access to premium fashion at fair prices.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-4 flex items-center gap-2">
              <span className="w-5 h-px bg-accent" /> Why We Exist
            </p>
            <h2 className="font-display text-4xl font-bold mb-6">
              <ScrollFloat scrollOffset={['start 90%', 'start 50%']}>Our </ScrollFloat>
              <ScrollFloat scrollOffset={['start 88%', 'start 48%']} accentWords={['Mission']}>Mission</ScrollFloat>
            </h2>
            <p className="text-muted leading-relaxed mb-4 text-sm">
              PREMIUM was founded with one mission: to make high-quality men's fashion accessible to every Pakistani man, from Karachi to Chitral. We source the finest fabrics, work with skilled craftsmen, and deliver premium pieces at prices that make sense.
            </p>
            <p className="text-muted leading-relaxed mb-8 text-sm">
              Whether it's a formal blazer for a business meeting, an embroidered kurta for Eid, or everyday essentials — we have you covered with style.
            </p>
            <Link to="/shop">
              <button className="px-8 py-3.5 bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors rounded-xl accent-glow">
                Shop Our Collection
              </button>
            </Link>
          </motion.div>

          {/* Stats grid */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-3">
            {[
              { stat: '15K+', label: 'Customers' },
              { stat: '200+', label: 'Products' },
              { stat: '50+',  label: 'Cities' },
              { stat: '4.8',  label: 'Avg Rating' },
            ].map(({ stat, label }) => (
              <div key={label} className="panel-inset border-subtle-themed p-6 text-center rounded-xl card-depth">
                <p className="font-display text-4xl font-bold text-accent mb-1"
                  style={{ textShadow: '0 0 20px rgba(200,16,46,0.4)' }}>{stat}</p>
                <p className="text-muted text-xs uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 section-depth">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-3 flex items-center justify-center gap-2">
              <span className="w-5 h-px bg-accent" /> Since 2019 <span className="w-5 h-px bg-accent" />
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              <ScrollFloat scrollOffset={['start 90%', 'start 50%']}>Our </ScrollFloat>
              <ScrollFloat scrollOffset={['start 88%', 'start 48%']} accentWords={['Journey']}>Journey</ScrollFloat>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/25 to-transparent" />
            <div className="space-y-4">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                  viewport={{ once: true }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-10 h-10 flex-shrink-0 bg-accent flex items-center justify-center text-[11px] font-bold text-white relative z-10 font-mono rounded-xl"
                    style={{ boxShadow: '0 0 16px rgba(200,16,46,0.35)' }}>
                    {m.year.slice(2)}
                  </div>
                  <div className="panel-inset border-subtle-themed p-4 flex-1 rounded-xl">
                    <p className="text-accent text-[10px] font-semibold tracking-wider mb-1 font-mono">{m.year}</p>
                    <p className="text-muted text-sm">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-3 flex items-center justify-center gap-2">
            <span className="w-5 h-px bg-accent" /> The People <span className="w-5 h-px bg-accent" />
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
            <ScrollFloat scrollOffset={['start 90%', 'start 50%']}>Meet the </ScrollFloat>
            <ScrollFloat scrollOffset={['start 88%', 'start 48%']} accentWords={['Team']}>Team</ScrollFloat>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col items-center"
              >
                <div className="w-24 h-24 overflow-hidden border-themed mb-4 group-hover:border-accent/40 transition-colors duration-300 rounded-2xl card-depth">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="font-medium text-sm">{member.name}</p>
                <p className="text-muted text-xs mt-0.5">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="privacy" className="py-16 px-4 sm:px-6 lg:px-8 section-depth">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-superwide uppercase text-accent font-semibold mb-3 flex items-center justify-center gap-2">
              <span className="w-5 h-px bg-accent" /> What We Stand For <span className="w-5 h-px bg-accent" />
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              <ScrollFloat scrollOffset={['start 90%', 'start 50%']}>Our </ScrollFloat>
              <ScrollFloat scrollOffset={['start 88%', 'start 48%']} accentWords={['Values']}>Values</ScrollFloat>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                viewport={{ once: true }}
                className="panel-inset border-subtle-themed p-6 group hover:border-accent/20 transition-colors duration-300 rounded-xl card-depth"
              >
                <div className="w-9 h-9 border-themed flex items-center justify-center text-accent mb-4 group-hover:border-accent/40 group-hover:bg-accent/[0.06] transition-all rounded-lg">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    {ValueIcons[v.key]}
                  </svg>
                </div>
                <p className="font-semibold text-sm mb-2">{v.title}</p>
                <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
