'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Github, Twitter, Send, MessageCircle, ArrowUp, Shield, Zap, Code, Globe, Calendar, X, ChevronDown } from 'lucide-react'

export function Footer() {
  const [auditModalOpen, setAuditModalOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    platform: false,
    developers: false,
    resources: false,
    company: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const footerColumns = [
    {
      title: 'Platform',
      links: [
        { label: 'Blockchain Explorer', href: '/explorer' },
        { label: 'Network Analytics', href: '/analytics' },
        { label: 'Testnet', href: '/testnet' },
        { label: 'Mainnet', href: '/mainnet' },
        { label: 'Validators', href: '/validators' },
      ],
    },
    {
      title: 'Developers',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/docs/api' },
        { label: 'SDK & Libraries', href: '/docs#sdk' },
        { label: 'Smart Contracts', href: '/contract-tools' },
        { label: 'GitHub', href: 'https://github.com/RainumBlockchain' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Whitepaper', href: '/whitepaper' },
        { label: 'Technology', href: '/technology' },
        { label: 'Blog & News', href: '/blog' },
        { label: 'Press Kit', href: '/press/presskit' },
        { label: 'Security', href: '/technology#security' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Rainum', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Enterprise', href: '/enterprise' },
        { label: 'Terms', href: '/legal/terms' },
        { label: 'Privacy', href: '/legal/privacy' },
      ],
    },
  ]

  const networkFeatures = [
    { icon: Shield, label: 'Security Audits', value: 'Q1 2026', subtitle: 'Halborn & CertiK', color: '#01ec97' },
    { icon: Zap, label: 'Speed', value: '200K TPS', color: '#01ec97' },
    { icon: Code, label: 'Dual-VM', value: 'EVM + Move', color: '#01ec97' },
    { icon: Globe, label: 'Network', value: 'Global', color: '#01ec97' },
  ]

  const socialLinks = [
    { Icon: Github, href: 'https://github.com/RainumBlockchain' },
    { Icon: Twitter, href: '#' },
    { Icon: Send, href: '#' },
    { Icon: MessageCircle, href: '#' },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#0019ff] text-white relative">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-4 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 md:gap-8 mb-4 md:mb-8">
            {/* Logo & Description */}
            <div>
              <div className="mb-3 md:mb-4">
                <Image
                  src="/rainum-logo-full.svg"
                  alt="Rainum"
                  width={120}
                  height={24}
                  className="brightness-0 invert"
                />
              </div>
              <p className="text-xs md:text-sm text-white/80 leading-relaxed mb-2 md:mb-3 max-w-[300px]">
                High-performance blockchain with 200K+ TPS, dual-VM execution, and enterprise-grade security.
              </p>
              <p className="text-xs text-white/60 mb-4 md:mb-6">
                Powered by: <span className="font-semibold text-white/80">Rainum Labs Ltd.</span>
              </p>

              {/* Network Status Cards */}
              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="p-2 md:p-3 bg-[#01ec97]/15 border border-[#01ec97]/30 rounded">
                  <p className="text-[10px] md:text-xs text-white/70 mb-1">Status</p>
                  <p className="text-xs md:text-sm font-bold text-[#01ec97]">Live</p>
                </div>
                <div className="p-2 md:p-3 bg-white/10 border border-white/20 rounded">
                  <p className="text-[10px] md:text-xs text-white/70 mb-1">Uptime</p>
                  <p className="text-xs md:text-sm font-bold text-white">99.99%</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-2 md:gap-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 md:w-10 md:h-10 bg-white/10 border border-white/20 rounded flex items-center justify-center text-white/80 hover:bg-white hover:text-[#0019ff] transition-all hover:scale-110"
                  >
                    <social.Icon size={16} className="md:w-5 md:h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {footerColumns.map((column, i) => {
              const sectionKey = column.title.toLowerCase()
              const isExpanded = expandedSections[sectionKey]
              return (
                <div key={i}>
                  {/* Desktop: Always visible */}
                  <div className="hidden md:block">
                    <h4 className="text-[11px] font-bold text-[#01ec97] uppercase tracking-widest mb-4">
                      {column.title}
                    </h4>
                    <ul className="space-y-2">
                      {column.links.map((link, j) => (
                        <li key={j}>
                          <a
                            href={link.href}
                            className="text-sm text-white/80 hover:text-white transition-all hover:translate-x-1 inline-block"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mobile: Collapsible */}
                  <div className="block md:hidden">
                    <button
                      onClick={() => toggleSection(sectionKey)}
                      className="flex items-center justify-between w-full py-3 border-b border-white/10 hover:bg-white/5 transition-all"
                    >
                      <span className="text-base font-semibold text-white">{column.title}</span>
                      <ChevronDown
                        size={20}
                        className={`text-white/70 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isExpanded && (
                      <ul className="space-y-2 py-2">
                        {column.links.map((link, j) => (
                          <li key={j}>
                            <a
                              href={link.href}
                              className="text-sm text-white/70 hover:text-white transition-all hover:translate-x-1 inline-block pl-2"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Feature Highlights */}
          <div className="py-3 md:py-5 border-y-2 border-white/20 mb-4 md:mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {networkFeatures.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div key={i} className="flex items-center gap-3 md:gap-4">
                    <div className="w-9 h-9 md:w-11 md:h-11 bg-[#01ec97]/15 border border-[#01ec97]/30 rounded flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="md:w-6 md:h-6" style={{ color: feature.color }} />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs text-white/60">{feature.label}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs md:text-sm font-bold text-white">{feature.value}</p>
                        {feature.subtitle && (
                          <button
                            onClick={() => setAuditModalOpen(true)}
                            className="px-1 py-0.5 bg-yellow-500/20 border border-yellow-500/40 rounded text-[8px] font-bold text-yellow-500 uppercase hover:bg-yellow-500/30 transition-all"
                          >
                            Info
                          </button>
                        )}
                      </div>
                      {feature.subtitle && (
                        <div className="flex gap-1.5 mt-1.5">
                          <a
                            href="https://www.halborn.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-white/20 border border-white/30 rounded text-[10px] font-bold text-white hover:bg-white/30 transition-all"
                          >
                            Halborn
                          </a>
                          <a
                            href="https://www.certik.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-white/20 border border-white/30 rounded text-[10px] font-bold text-white hover:bg-white/30 transition-all"
                          >
                            CertiK
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-sm text-white/60">
              © 2025 Rainum Labs. All rights reserved.
            </p>

            <div className="flex gap-8 items-center">
              <a href="/legal/terms" className="text-sm text-white/70 hover:text-white transition-colors">
                Terms
              </a>
              <a href="/legal/privacy" className="text-sm text-white/70 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/technology#security" className="text-sm text-white/70 hover:text-white transition-colors">
                Security
              </a>

              {/* Scroll to Top */}
              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-[#01ec97]/15 border border-[#01ec97]/30 rounded flex items-center justify-center text-[#01ec97] hover:bg-[#01ec97] hover:text-black hover:-translate-y-1 transition-all ml-4"
              >
                <ArrowUp size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Details Modal */}
      {auditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setAuditModalOpen(false)}>
          <div className="bg-white rounded-lg p-8 max-w-lg w-[90%] relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setAuditModalOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div className="w-15 h-15 bg-[#0019ff] rounded-lg flex items-center justify-center mb-6">
              <Shield size={32} className="text-white" />
            </div>

            {/* Title */}
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Security Audits
            </h3>

            {/* Date */}
            <div className="flex items-center gap-2 mb-6">
              <Calendar size={16} className="text-gray-600" />
              <p className="text-base text-gray-600">
                Expected: <span className="font-bold text-gray-900">March 22, 2026</span>
              </p>
            </div>

            {/* Description */}
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              Rainum blockchain will undergo comprehensive security audits by industry-leading firms Halborn and CertiK. These audits will verify our smart contract security, consensus mechanism, and overall network integrity.
            </p>

            {/* Audit Firms */}
            <div className="mb-6">
              <p className="text-xs text-gray-600 uppercase tracking-widest font-bold mb-3">Audit Partners</p>
              <div className="flex gap-4">
                <a
                  href="https://www.halborn.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-4 bg-gray-50 border-2 border-gray-200 rounded hover:border-[#0019ff] hover:shadow-lg transition-all"
                >
                  <p className="text-sm font-bold text-gray-900 mb-1">Halborn</p>
                  <p className="text-xs text-gray-600">Blockchain Security</p>
                </a>
                <a
                  href="https://www.certik.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-4 bg-gray-50 border-2 border-gray-200 rounded hover:border-[#0019ff] hover:shadow-lg transition-all"
                >
                  <p className="text-sm font-bold text-gray-900 mb-1">CertiK</p>
                  <p className="text-xs text-gray-600">Smart Contract Audit</p>
                </a>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setAuditModalOpen(false)}
              className="w-full bg-[#0019ff] text-white font-bold py-3 rounded hover:bg-[#0033ff] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </footer>
  )
}
