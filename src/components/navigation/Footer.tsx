import Link from "next/link";
import { Rocket, Mail, Instagram, Youtube, Facebook } from "lucide-react";

const footerLinks = {
  explore: [
    { name: "About Us", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Projects", href: "/projects" },
    { name: "Gallery", href: "/gallery" },
  ],
  resources: [
    { name: "Join Club", href: "/join" },
    { name: "Resources", href: "/resources" },
    { name: "Contact", href: "/contact" },
    { name: "Team", href: "/team" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/tahomarocketry",
    icon: Instagram
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@tahomarocketry",
    icon: Youtube
  },
  {
    name: "Facebook",
    href: "https://facebook.com/tahomarocketry",
    icon: Facebook
  },
  {
    name: "Email",
    href: "mailto:contact@tahomarocketry.club",
    icon: Mail
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-space-darkest text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="font-heading font-bold text-xl leading-none">
                  Tahoma Rocketry
                </div>
                <div className="text-sm text-white/70">Club</div>
              </div>
            </Link>
            <p className="text-white/70 mb-6 leading-relaxed">
              Inspiring the next generation of aerospace engineers through hands-on
              rocket design, building, and launching.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-primary flex items-center justify-center transition-all hover:scale-110"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 h-px bg-space-electric transition-all group-hover:w-4 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 h-px bg-space-electric transition-all group-hover:w-4 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-white/70">
              <p className="leading-relaxed">
                Tahoma High School<br />
                18200 SE 240th St<br />
                Maple Valley, WA 98038
              </p>
              <p>
                <strong className="text-white">Meetings:</strong><br />
                Tuesdays during Power Hour A
              </p>
              <p>
                <a
                  href="mailto:contact@tahomarocketry.club"
                  className="text-space-electric hover:text-white transition-colors"
                >
                  contact@tahomarocketry.club
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © {currentYear} Tahoma Rocketry Club. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
