// Minimum temperature (celsius) for water heater
export const MIN_WATER_TEMP = 49;
// Maximum temperature (celsius) for water heater
export const MAX_WATER_TEMP = 60;
// Minimum temperature (celsius) for air conditioner
export const MIN_AC_TEMP = 16;
// Maximum temperature (celsius) for air conditioner
export const MAX_AC_TEMP = 30;
// Minimum brightness for dimmable light
export const MIN_BRIGHTNESS = 0;
// Maximum brightness for dimmable light
export const MAX_BRIGHTNESS = 100;

// Default status for a water heater
export const DEFAULT_WATER_HEATER_STATUS = "off";
// Default target temperature for a water heater
export const DEFAULT_WATER_TEMP = 60;
// Whether or not a water heater has a timer enabled by default
export const DEFAULT_TIMER_ENABLED = false;
// Default start time for a timed water heater
export const DEFAULT_START_TIME = "06:30";
// Default stop time for a timed water heater
export const DEFAULT_STOP_TIME = "08:00";

// Default status for an air conditioner
export const DEFAULT_AC_STATUS = "off";
// Default target temperature for an air conditioner
export const DEFAULT_AC_TEMP = 24;
// Default mode for an air conditioner
export const DEFAULT_AC_MODE = "cool";
// Default fan speed for an air conditioner
export const DEFAULT_AC_FAN = "low";
// Default swing mode for an air conditioner
export const DEFAULT_AC_SWING = "off";

// Default status for a light
export const DEFAULT_LIGHT_STATUS = "off";
// Whether or not a light is dimmable by default
export const DEFAULT_DIMMABLE = false;
// Default brightness for a dimmable light
export const DEFAULT_BRIGHTNESS = 80;
// Whether or not a light has dynamic color by default
export const DEFAULT_DYNAMIC_COLOR = false;
// Default color for a dynamic color light
export const DEFAULT_LIGHT_COLOR = "#FFFFFF";

// Default status for a door lock
export const DEFAULT_LOCK_STATUS = "unlocked";
// Whether or not a door lock has auto-lock enabled by default
export const DEFAULT_AUTO_LOCK_ENABLED = false;
// Default battery level for a door lock
export const DEFAULT_BATTERY = 100;

// Default status for a curtain
export const DEFAULT_CURTAIN_STATUS = "open";
// Default position for a curtain
export const DEFAULT_POSITION = 100;

// Regex to check for valid ISO format time string
export const TIME_REGEX = /^([01][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/;
// Regex to check for valid hex color string
export const COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
