import { APP_NAME, LOGO_DARK, LOGO_ICON } from "@calcom/lib/constants";
import classNames from "@calcom/ui/classNames";

export function Logo({
  small,
  icon,
  inline = true,
  className,
  src = "/api/logo",
}: {
  small?: boolean;
  icon?: boolean;
  inline?: boolean;
  className?: string;
  src?: string;
}) {
  const isDefaultSrc = src === "/api/logo";
  const imgSize = small ? "h-4 w-auto" : "h-5 w-auto";
  // Color logos cannot use invert — cream wordmark is for dark UI, ink wordmark for light.
  const darkImgClass = inline ? "hidden dark:inline" : "hidden dark:block";

  return (
    <h3 className={classNames("logo", inline && "inline", className)}>
      <strong>
        {icon ? (
          <img
            className={classNames("mx-auto w-9", !isDefaultSrc && "dark:invert")}
            alt={APP_NAME}
            title={APP_NAME}
            src={isDefaultSrc ? LOGO_ICON : `${src}?type=icon`}
          />
        ) : (
          <>
            <img
              className={classNames(imgSize, isDefaultSrc ? "dark:hidden" : "dark:invert")}
              alt={APP_NAME}
              title={APP_NAME}
              src={src}
            />
            {isDefaultSrc ? (
              <img
                className={classNames(imgSize, darkImgClass)}
                alt={APP_NAME}
                title={APP_NAME}
                src={LOGO_DARK}
              />
            ) : null}
          </>
        )}
      </strong>
    </h3>
  );
}
