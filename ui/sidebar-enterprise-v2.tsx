// ui/sidebar-enterprise-v2.tsx
// Phase 2: shadcn Sidebar + Collapsible rebuild of the enterprise sidebar.
// Figma: sidebar-primary-v2-enterprise (node 14155:233892)
// Legacy reference (behavior + visuals, not to be modified): components/sidebarEnterpriseV2.ts, styles/sidebar-enterprise-v2.css
//
// Uses shadcn's Sidebar primitive (ui/sidebar.tsx) as-is, with its own default
// width/colors/behavior — not yet reconciled with the Mizou tokens or the
// 244px/72px Figma dimensions. That reconciliation is a deliberate follow-up.

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
import { cn } from './lib/cn';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  useSidebar,
} from './sidebar';
import { icons, type IconName } from '../icons';

export type SidebarV2Team = {
  name: string;
  initials: string;
  /** Not in the token system — carried over as component data, per Figma. */
  color: string;
};

export type SidebarEnterpriseV2Props = {
  /** Start in collapsed (rail) state */
  defaultCollapsed?: boolean;
  /** Fired when the user toggles the sidebar collapsed/expanded via its own header buttons */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Organization/workspace name shown in the header button */
  orgName?: string;
  /** Organization logo icon name */
  orgLogo?: IconName;
  /** Teams listed under the TEAMS section */
  teams?: SidebarV2Team[];
  /** Names of teams rendered expanded initially. Each team toggles independently. */
  defaultExpandedTeams?: string[];
  /**
   * Team + sub-nav label to select initially (e.g. "Assigned Simulations" within
   * `activeTeamName`). After the first click anywhere in the sidebar, selection is
   * tracked internally so exactly one item is ever focused at a time.
   */
  activeSubNav?: string;
  /** Name of the user's currently active/selected team — gets a highlighted card background */
  activeTeamName?: string;
  /** Fired when a team's sub-nav link (Assigned Simulations / Sessions / Team Members / Team Settings) is clicked */
  onTeamSubNavClick?: (teamName: string, item: string) => void;
  /** Fired when a team's header (avatar + name) is clicked, e.g. to navigate to that team's page */
  onTeamSelect?: (teamName: string) => void;
  /** Fired when the footer Feedback button is clicked */
  onFeedbackClick?: () => void;
  /** Hide the "Collections" nav item. Default false. */
  hideCollections?: boolean;
  /** Hide the "Create" button. Default false. */
  hideCreateButton?: boolean;
  className?: string;
};

export const defaultSidebarV2Teams: SidebarV2Team[] = [
  { name: 'Alpha', initials: 'A', color: '#f68c0a' },
  { name: 'Beta', initials: 'B', color: '#f60aea' },
  { name: 'Charlie', initials: 'C', color: '#7fe41a' },
];

const learningHubSubItems = ['My Assigned Simulations', 'My Sessions'];
const collectionsSubItems = ['My Publications', 'My Templates Library'];
const teamSubNavItems = ['Assigned Simulations', 'Sessions', 'Team Members', 'Team Settings'];

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <span
      className={cn('sb-icon shrink-0', className)}
      // Trusted, repo-local SVG assets — see icons/index.ts.
      dangerouslySetInnerHTML={{ __html: icons[name] }}
    />
  );
}

/** Everything below SidebarProvider — split out so it can call useSidebar(). */
function SidebarEnterpriseV2Inner({
  onCollapsedChange,
  orgName = 'ACME',
  orgLogo = 'logo-sq-acme' as IconName,
  teams = defaultSidebarV2Teams,
  defaultExpandedTeams,
  activeSubNav,
  activeTeamName,
  onTeamSubNavClick,
  onTeamSelect,
  onFeedbackClick,
  hideCollections = false,
  hideCreateButton = false,
  className,
}: Omit<SidebarEnterpriseV2Props, 'defaultCollapsed'>) {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';

  const [learningHubOpen, setLearningHubOpen] = React.useState(false);
  const [collectionsOpen, setCollectionsOpen] = React.useState(false);
  const [teamsOpen, setTeamsOpen] = React.useState(true);
  const [expandedTeams, setExpandedTeams] = React.useState<Set<string>>(
    () => new Set(defaultExpandedTeams),
  );

  // Exactly one nav leaf is selected/focused at a time. Keyed by
  // 'all-sessions' or `team:${teamName}:${subNavItem}`.
  const [selectedItem, setSelectedItem] = React.useState<string | undefined>(() =>
    activeTeamName && activeSubNav ? `team:${activeTeamName}:${activeSubNav}` : undefined,
  );

  function handleFeedbackClick() {
    if (onFeedbackClick) {
      onFeedbackClick();
      return;
    }
    // TODO: wire to Canny once the feedback-collection hookup exists.
  }

  function handleToggleCollapsed() {
    toggleSidebar();
    onCollapsedChange?.(!collapsed);
  }

  function setTeamOpen(name: string, open: boolean) {
    setExpandedTeams((prev) => {
      const next = new Set(prev);
      if (open) next.add(name);
      else next.delete(name);
      return next;
    });
  }

  return (
    <Sidebar collapsible="icon" className={className}>
      {/* ----- Header ----- */}
      <SidebarHeader>
        {collapsed ? (
          <button type="button" aria-label="Expand sidebar" onClick={handleToggleCollapsed}>
            <Icon name={'chevron-bar-right' as IconName} />
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded="false"
              className="flex items-center gap-2xs"
              style={{ minWidth: 0 }}
            >
              <Icon name={orgLogo} />
              <span title={orgName} className="truncate font-bold">
                {orgName}
              </span>
              <Icon name={'chevron-down-sm' as IconName} />
            </button>
            <button type="button" aria-label="Collapse sidebar" onClick={handleToggleCollapsed}>
              <Icon name={'chevron-bar-left' as IconName} />
            </button>
          </div>
        )}
      </SidebarHeader>

      {/* ----- Content ----- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {!hideCreateButton && (
              <div className="flex justify-center pb-2xs">
                {collapsed ? (
                  <button type="button" className="sb-create-btn sb-create-btn--minimized" aria-label="Create">
                    <Icon name={'ai-sparkle' as IconName} className="sb-create-btn__icon" />
                  </button>
                ) : (
                  <button type="button" className="sb-create-btn sb-create-btn--expanded">
                    <Icon name={'ai-sparkle' as IconName} className="sb-create-btn__icon" />
                    <span className="sb-create-btn__label">Create</span>
                  </button>
                )}
              </div>
            )}

            <SidebarMenu>
              {/* My Learning Hub — independently expandable, placeholder sub-items */}
              <Collapsible asChild open={learningHubOpen} onOpenChange={setLearningHubOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="My Learning Hub">
                      <Icon name={'courses' as IconName} />
                      <span>My Learning Hub</span>
                      <Icon
                        name={'chevron-down-sm' as IconName}
                        className={cn('ml-auto transition-transform', learningHubOpen ? 'rotate-0' : '-rotate-90')}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {learningHubSubItems.map((item) => (
                        <SidebarMenuSubItem key={item}>
                          <span className="flex cursor-not-allowed select-none items-center px-2xs py-3xs opacity-disabled">{item}</span>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {!hideCollections && (
                <Collapsible asChild open={collectionsOpen} onOpenChange={setCollectionsOpen}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip="Collections">
                        <Icon name={'my-collection' as IconName} />
                        <span>Collections</span>
                        <Icon
                          name={'chevron-down-sm' as IconName}
                          className={cn('ml-auto transition-transform', collectionsOpen ? 'rotate-0' : '-rotate-90')}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {collectionsSubItems.map((item) => (
                          <SidebarMenuSubItem key={item}>
                            <span className="flex cursor-not-allowed select-none items-center px-2xs py-3xs opacity-disabled">{item}</span>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="All Sessions" isActive={selectedItem === 'all-sessions'}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedItem('all-sessions');
                    }}
                  >
                    <Icon name={'session-list' as IconName} />
                    <span>All Sessions</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ----- Teams ----- */}
        <SidebarGroup>
          <Collapsible open={teamsOpen} onOpenChange={setTeamsOpen}>
            <SidebarMenu>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <Icon name={'management' as IconName} />
                    <span>Teams</span>
                    <Icon
                      name={'chevron-down-sm' as IconName}
                      className={cn('ml-auto transition-transform', teamsOpen ? 'rotate-0' : '-rotate-90')}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </SidebarMenu>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {teams.map((team) => {
                    const isExpanded = expandedTeams.has(team.name);
                    const isActiveTeam = team.name === activeTeamName;
                    const teamBody = (
                      <Collapsible
                        key={team.name}
                        asChild
                        open={isExpanded}
                        onOpenChange={(open) => setTeamOpen(team.name, open)}
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton onClick={() => onTeamSelect?.(team.name)} tooltip={team.name}>
                              <span
                                className="grid shrink-0 place-items-center rounded-sm text-xs font-bold text-content-inverse"
                                style={{
                                  width: 20,
                                  height: 20,
                                  background: team.color,
                                  boxShadow:
                                    collapsed && isExpanded
                                      ? '0 0 0 2px var(--surface-raised), 0 0 0 4px var(--interactive-primary)'
                                      : undefined,
                                }}
                              >
                                {team.initials.toUpperCase()}
                              </span>
                              <span>{team.name}</span>
                              {isExpanded ? (
                                <Minus className="ml-auto size-4 shrink-0" aria-hidden="true" />
                              ) : (
                                <Plus className="ml-auto size-4 shrink-0" aria-hidden="true" />
                              )}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {teamSubNavItems.map((item) => {
                                const itemKey = `team:${team.name}:${item}`;
                                return (
                                  <SidebarMenuSubItem key={item}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={selectedItem === itemKey}
                                    >
                                      <a
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setSelectedItem(itemKey);
                                          onTeamSubNavClick?.(team.name, item);
                                        }}
                                      >
                                        {item}
                                      </a>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );

                    if (!isActiveTeam) return teamBody;

                    return (
                      <div key={team.name} className="rounded-lg bg-sidebar-accent p-3xs">
                        {teamBody}
                      </div>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      {/* ----- Feedback ----- */}
      <SidebarFooter>
        {collapsed ? (
          <button
            type="button"
            aria-label="Feedback"
            className="sb-btn-icon sb-btn-icon--tertiary sb-btn-icon--sm"
            onClick={handleFeedbackClick}
          >
            <Icon name={'feedback' as IconName} className="sb-btn-icon__icon" />
          </button>
        ) : (
          <button
            type="button"
            className="sb-button sb-button--tertiary sb-button--sm"
            onClick={handleFeedbackClick}
          >
            <span className="sb-button__icon">
              <Icon name={'feedback' as IconName} />
            </span>
            <span>Feedback</span>
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export function SidebarEnterpriseV2({ defaultCollapsed = false, ...rest }: SidebarEnterpriseV2Props) {
  return (
    <SidebarProvider defaultOpen={!defaultCollapsed}>
      <SidebarEnterpriseV2Inner {...rest} />
    </SidebarProvider>
  );
}
