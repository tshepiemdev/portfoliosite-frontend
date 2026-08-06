import { useEffect } from "react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { getCountryCallingCode } from "libphonenumber-js/min";
countries.registerLocale(enLocale);

export default function useDetectLocation(setForm) {
  useEffect(() => {
    const detectCountry = () => {
      const locale = navigator.language || "";

      const countryCode = locale.split("-")[1];

      if (!countryCode) return;

      const countryName = countries.getName(countryCode, "en");

      if (!countryName) return;

      let dialCode;

      try {
        dialCode = `+${getCountryCallingCode(countryCode)}`;
      } catch {
        return;
      }

      setForm((prev) => ({
        ...prev,
        country: countryCode,

        phone: {
          ...prev.phone,
          iso: countryCode,
          code: dialCode,
        },
      }));
    };

    detectCountry();
  }, [setForm]);
}
