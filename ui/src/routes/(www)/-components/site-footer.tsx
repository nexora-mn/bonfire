import { Link } from "@tanstack/react-router";
import { Container } from "@/components/container";
import { FlameMark } from "@/components/flame-mark";

const columns = [
  {
    title: "Bonfire",
    links: [
      { to: "/ai", label: "Хиймэл оюун" },
      { to: "/roadmap", label: "Замын зураг" },
      { to: "/blog", label: "Блог" },
    ],
  },
  {
    title: "Хэрэгсэл",
    links: [
      { to: "/qr-code", label: "QR код" },
      { label: "Стрим мэдэгдэл", soon: true },
    ],
  },
  {
    title: "Эхлэх",
    links: [
      { to: "/signup", label: "Бүртгүүлэх" },
      { to: "/login", label: "Нэвтрэх" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-foreground/10 pt-16">
      <Container>
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-2xl font-extrabold"
            >
              <FlameMark className="size-8 text-foreground" />
              {"Bonfire"}
            </Link>
            <p className="mt-4 max-w-xs text-foreground/60">
              {"Доторх галаа дүрэлзүүл"}
            </p>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-semibold tracking-wide text-foreground/45 uppercase">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) =>
                  "to" in link ? (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ) : (
                    <li
                      key={link.label}
                      className="flex items-center gap-2 text-lg font-medium text-foreground/45"
                    >
                      {link.label}
                      <span className="rounded-full bg-flame px-2 py-0.5 font-hand text-xs text-ink">
                        {"Удахгүй"}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-16 border-t border-foreground/10 pt-6 text-sm text-foreground/45">
          &copy; {new Date().getFullYear()} {"Bonfire"}
        </p>
      </Container>
      <p
        aria-hidden="true"
        className="pointer-events-none mt-6 mb-[-0.2em] text-center text-[clamp(5rem,24vw,22rem)] leading-[0.8] font-extrabold  text-foreground/6 select-none"
      >
        {"Bonfire"}
      </p>
    </footer>
  );
}
