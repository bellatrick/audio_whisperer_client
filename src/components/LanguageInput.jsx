
import { languages } from 'countries-list';

// eslint-disable-next-line react/prop-types
const LanguageCodeDropdown = ({ setTargetLanguage }) => {
  // Convert language codes to a format suitable for dropdown
  const languageCodes = Object.keys(languages).map(code => ({
    value: code,
    label: `${code} - ${languages[code].name}`
  }));

  return (
    <div className="space-y-2 mt-4 lg:w-[50%]">
      <label htmlFor="targetLanguage" className="block text-green-100 font-medium">
        Select a target language code
      </label>
      <select
        id="targetLanguage"
        name="targetLanguage"
        onChange={(e) => setTargetLanguage(e.target.value)}
        className="w-full py-2 px-4 border-2 border-green-500 rounded-lg bg-green-50 focus:ring-2 focus:ring-green-300"
      >
        <option value="" disabled>Select language code (e.g., en)</option>
        {languageCodes.map((lang) => (
          <option key={lang.value} value={lang.value} className="hover:bg-green-100 focus:bg-green-200">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageCodeDropdown;
