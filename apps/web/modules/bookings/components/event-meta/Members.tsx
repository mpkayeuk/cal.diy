import { useIsPlatform } from "@calcom/atoms/hooks/useIsPlatform";
import { useIsEmbed } from "@calcom/embed-core/embed-iframe";
import { useBookerStore } from "@calcom/features/bookings/Booker/store";
import type { BookerEvent } from "@calcom/features/bookings/types";
import { APP_NAME, LOGO, LOGO_DARK, POWERED_BY_URL, WEBAPP_URL } from "@calcom/lib/constants";
import { getUserAvatarUrl } from "@calcom/lib/getAvatarUrl";
import { SchedulingType } from "@calcom/prisma/enums";
import { AvatarGroup } from "@calcom/ui/components/avatar";

export interface EventMembersProps {
  /**
   * Used to determine whether all members should be shown or not.
   * In case of Round Robin type, members aren't shown.
   */
  schedulingType: BookerEvent["schedulingType"];
  users: BookerEvent["subsetOfUsers"];
  profile: BookerEvent["profile"];
  entity: BookerEvent["entity"];
  isPrivateLink: boolean;
  roundRobinHideOrgAndTeam?: boolean;
  hideOrgTeamAvatar?: boolean;
}

export const EventMembers = ({
  schedulingType,
  users,
  profile,
  entity,
  isPrivateLink,
  roundRobinHideOrgAndTeam,
  hideOrgTeamAvatar,
}: EventMembersProps) => {
  const username = useBookerStore((state) => state.username);
  const isDynamic = !!(username && username.indexOf("+") > -1);
  const isEmbed = useIsEmbed();
  const isPlatform = useIsPlatform();

  const showMembers = schedulingType !== SchedulingType.ROUND_ROBIN;
  const shownUsers = showMembers ? users : [];
  // In some cases we don't show the user's names, but only show the profile name.
  const showOnlyProfileName =
    (profile.name && schedulingType === SchedulingType.ROUND_ROBIN) ||
    !users.length ||
    (profile.name !== users[0].name && schedulingType === SchedulingType.COLLECTIVE);

  if (schedulingType === SchedulingType.ROUND_ROBIN && roundRobinHideOrgAndTeam) {
    return <BookerBrandLogo hidden={isPlatform} />;
  }

  if (schedulingType === SchedulingType.ROUND_ROBIN && hideOrgTeamAvatar) {
    return (
      <div className="flex flex-col items-start gap-3 pt-2">
        <BookerBrandLogo hidden={isPlatform} />
        <p className="min-w-0 truncate font-semibold text-sm text-subtle">{profile.name}</p>
      </div>
    );
  }

  const orgOrTeamAvatarItem =
    hideOrgTeamAvatar || isDynamic || (!profile.image && !entity.logoUrl) || !entity.teamSlug
      ? []
      : [
          {
            // We don't want booker to be able to see the list of other users or teams inside the embed
            href:
              isEmbed || isPlatform || isPrivateLink || entity.hideProfileLink
                ? null
                : entity.teamSlug
                  ? `${WEBAPP_URL}/team/${entity.teamSlug}`
                  : WEBAPP_URL,
            image: entity.logoUrl ?? profile.image ?? "",
            alt: entity.name ?? profile.name ?? "",
            title: entity.name ?? profile.name ?? "",
          },
        ];

  const hostName = showOnlyProfileName
    ? profile.name
    : shownUsers
        .map((user) => user.name)
        .filter((name) => name)
        .join(", ");

  return (
    <div className="flex flex-col items-start gap-3">
      <BookerBrandLogo hidden={isPlatform} />
      <div className="flex min-w-0 items-center gap-2">
        <AvatarGroup
          size="sm"
          className="border-muted"
          items={[
            ...orgOrTeamAvatarItem,
            ...shownUsers.map((user) => ({
              href:
                isPlatform || isPrivateLink || entity.hideProfileLink
                  ? null
                  : `${WEBAPP_URL}/${user.profile?.username}?redirect=false`,
              alt: user.name || "",
              title: user.name || "",
              image: getUserAvatarUrl(user),
            })),
          ]}
        />
        <p className="min-w-0 truncate font-semibold text-sm text-subtle">{hostName}</p>
      </div>
    </div>
  );
};

function BookerBrandLogo({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return null;
  }

  return (
    <a href={POWERED_BY_URL} target="_blank" rel="noreferrer" className="shrink-0">
      <img src={LOGO} alt={APP_NAME} className="h-12 w-auto dark:hidden" />
      <img src={LOGO_DARK} alt="" className="hidden h-12 w-auto dark:inline" />
    </a>
  );
}
