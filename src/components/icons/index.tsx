import type { SVGProps } from "react";
import {
  BriefcaseIcon,
  CameraIcon,
  HeartIcon,
} from "./ServiceIcons";
import {
  CalendarDaysIcon,
  ChartPieIcon,
  ChatBubbleLeftEllipsisIconSolid,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  CursorArrowRaysIcon,
  EnvelopeIconSolid,
  GiftIcon,
  QrCodeIcon,
  SparklesIcon,
  UserCircleIcon,
  UserIconSolid,
  UsersIcon,
  XMarkIcon,
} from "./UiIcons";

type IconComponent = (
  props: SVGProps<SVGSVGElement> & { className?: string },
) => React.ReactElement;

const iconMap: Record<string, IconComponent> = {
  heart: HeartIcon,
  briefcase: BriefcaseIcon,
  camera: CameraIcon,
  qrCode: QrCodeIcon,
  gift: GiftIcon,
  cursorArrowRays: CursorArrowRaysIcon,
  clipboardDocumentCheck: ClipboardDocumentCheckIcon,
  users: UsersIcon,
  sparkles: SparklesIcon,
  chartPie: ChartPieIcon,
  calendarDays: CalendarDaysIcon,
};

export function IconFromKey({
  iconKey,
  className,
  ...rest
}: { iconKey: string } & SVGProps<SVGSVGElement> & { className?: string }) {
  const Component = iconMap[iconKey] ?? SparklesIcon;
  return <Component className={className} {...rest} />;
}

export {
  BriefcaseIcon,
  CalendarDaysIcon,
  CameraIcon,
  ChartPieIcon,
  ChatBubbleLeftEllipsisIconSolid,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  CursorArrowRaysIcon,
  EnvelopeIconSolid,
  GiftIcon,
  HeartIcon,
  QrCodeIcon,
  SparklesIcon,
  UserCircleIcon,
  UserIconSolid,
  UsersIcon,
  XMarkIcon,
};
export { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "./SocialIcons";
