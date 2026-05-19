/* eslint-disable */
/**
 * Ethenios Design System — prototype shell.
 * One-page browser with persistent section selection via URL hash.
 */

const { useState, useEffect } = React;

const SECTIONS = [
  { group: "Overview",            id: "cover",      num: "00.0", label: "Cover",                  component: "Cover"           },
  { group: "Overview",            id: "principles", num: "00.1", label: "Design Principles",      component: "Principles"      },
  { group: "Brand",               id: "logo",       num: "01.0", label: "Logo & Wordmark",        component: "BrandLogo"       },
  { group: "Brand",               id: "type",       num: "01.1", label: "Typography",             component: "BrandType"       },
  { group: "Brand",               id: "color",      num: "01.2", label: "Color",                  component: "BrandColor"      },
  { group: "Brand",               id: "spacing",    num: "01.3", label: "Spacing & Radii",        component: "BrandSpacing"    },
  { group: "Brand",               id: "icons",      num: "01.4", label: "Iconography",            component: "BrandIcons"      },
  { group: "Components",          id: "buttons",    num: "02.0", label: "Buttons",                component: "CompButtons"     },
  { group: "Components",          id: "forms",      num: "02.1", label: "Forms & Inputs",         component: "CompForms"       },
  { group: "Components",          id: "status",     num: "02.2", label: "Status & Data",          component: "CompStatus"      },
  { group: "Components",          id: "tables",     num: "02.3", label: "Tables",                 component: "CompTables"      },
  { group: "Components",          id: "cards",      num: "02.4", label: "Cards & Empty States",   component: "CompCards"       },
  { group: "Surfaces — Marketing",id: "landing",    num: "03.0", label: "Landing Page",           component: "Marketing"       },
  { group: "Surfaces — Auth",     id: "login",      num: "04.0", label: "Login",                  component: "AuthLogin"       },
  { group: "Surfaces — Auth",     id: "signup",     num: "04.1", label: "Sign up",                component: "AuthSignup"      },
  { group: "Surfaces — Auth",     id: "forgot",     num: "04.2", label: "Forgot password",        component: "AuthForgot"      },
  { group: "Surfaces — Onboarding",id:"onboarding", num: "05.0", label: "4-step wizard",          component: "Onboarding"      },
  { group: "Surfaces — Onboarding",id:"tour",       num: "05.1", label: "Product tour",           component: "ProductTourSurface" },
  { group: "Surfaces — App",      id: "shell",      num: "06.0", label: "App shell",              component: "AppShellSurface" },
  { group: "Surfaces — App",      id: "platform",   num: "06.1", label: "Platform dashboard",     component: "PlatformDashSurface" },
  { group: "Surfaces — App",      id: "orgdash",    num: "06.2", label: "Organization dashboard", component: "OrgDashSurface"  },
  { group: "Surfaces — App",      id: "policyiq",   num: "06.3", label: "PolicyIQ",               component: "PolicyIQSurface" },
  { group: "Surfaces — App",      id: "regatlas",   num: "06.4", label: "RegAtlas",               component: "RegAtlasSurface" },
  { group: "Surfaces — App",      id: "reports",    num: "06.5", label: "Reports",                component: "ReportsSurface"  },
  { group: "Surfaces — App",      id: "settings",   num: "06.6", label: "Settings",               component: "SettingsSurface" },
  { group: "Surfaces — App",      id: "units",      num: "06.7", label: "Organisation units",     component: "OrgUnitsSurface" },
  { group: "Documentation",       id: "audit",      num: "07.0", label: "UX Audit",               component: "UxAudit"         },
  { group: "Documentation",       id: "changes",    num: "07.1", label: "Change log",             component: "ChangeLog"       },
  { group: "Export",              id: "css",        num: "08.0", label: "global.css",             component: "GlobalCssExport" },
];

function Nav({ current, onSelect }) {
  const groups = [];
  let lastGroup = null;
  SECTIONS.forEach((s) => {
    if (s.group !== lastGroup) {
      groups.push({ title: s.group, items: [] });
      lastGroup = s.group;
    }
    groups[groups.length - 1].items.push(s);
  });

  return (
    <aside className="proto-nav">
      <div className="proto-nav-brand">
        <h1 className="wordmark">
          <Logo size={26} />
          Ethenios
        </h1>
        <p className="subtitle">Compliance Intelligence · Design System v1.0</p>
      </div>
      {groups.map((g, gi) => (
        <div key={gi} className="proto-nav-section">
          <p className="proto-nav-section-title">{g.title}</p>
          {g.items.map((it) => (
            <button
              key={it.id}
              className={`proto-nav-item ${current === it.id ? "active" : ""}`}
              onClick={() => onSelect(it.id)}
            >
              <span>{it.label}</span>
              <span className="num">{it.num}</span>
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}

function App() {
  const initial = (typeof window !== "undefined" && window.location.hash.replace("#", "")) || "cover";
  const valid = SECTIONS.find((s) => s.id === initial) ? initial : "cover";
  const [current, setCurrent] = useState(valid);

  useEffect(() => {
    window.history.replaceState(null, "", `#${current}`);
    document.querySelector(".proto-main")?.scrollTo({ top: 0, behavior: "instant" });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [current]);

  // Expose a global navigation function so surfaces can route between sections
  useEffect(() => {
    window.__ethnav = (id, opts) => {
      if (!SECTIONS.find((s) => s.id === id)) return;
      if (opts) {
        Object.assign(window, opts);
      }
      setCurrent(id);
    };
    return () => { delete window.__ethnav; };
  }, []);

  const section = SECTIONS.find((s) => s.id === current) || SECTIONS[0];
  const Surface = window[section.component] || (() => (
    <div className="doc-block" style={{ padding: 40 }}>
      <p>Section <code>{section.component}</code> not yet rendered.</p>
    </div>
  ));

  return (
    <div className="proto-app" data-screen-label={`Ethenios · ${section.label}`}>
      <Nav current={current} onSelect={setCurrent} />
      <main className="proto-main">
        <div className="proto-header">
          <div className="proto-header-row">
            <div>
              <p className="proto-header-eyebrow">Section {section.num} · {section.group}</p>
              <h1 className="proto-header-title">{section.label}</h1>
            </div>
            <div className="proto-header-meta">
              ETHENIOS · DESIGN SYSTEM v1.0<br />
              ISSUED · 18 MAY 2026
            </div>
          </div>
        </div>
        <div className="proto-body">
          <Surface />
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
