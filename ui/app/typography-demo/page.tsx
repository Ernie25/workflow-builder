export default function TypographyDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl space-y-12 bg-white p-12 rounded-lg shadow-sm">
        {/* Header */}
        <div>
          <h1 className="text-heading-xl text-gray-900 mb-2">
            Typography System
          </h1>
          <p className="text-body text-gray-600">
            Professional typography scale for workflow platforms
          </p>
        </div>

        {/* Headings Section */}
        <section className="space-y-6">
          <div>
            <p className="text-label text-gray-500 mb-2">HEADING XL</p>
            <h1 className="text-heading-xl text-gray-900">
              28px / Semi-bold / 1.3 line-height
            </h1>
            <code className="text-code text-gray-500 block mt-2">
              className="text-heading-xl"
            </code>
          </div>

          <div>
            <p className="text-label text-gray-500 mb-2">HEADING L</p>
            <h2 className="text-heading-l text-gray-900">
              24px / Semi-bold / 1.3 line-height
            </h2>
            <code className="text-code text-gray-500 block mt-2">
              className="text-heading-l"
            </code>
          </div>

          <div>
            <p className="text-label text-gray-500 mb-2">HEADING M</p>
            <h3 className="text-heading-m text-gray-900">
              20px / Semi-bold / 1.4 line-height
            </h3>
            <code className="text-code text-gray-500 block mt-2">
              className="text-heading-m"
            </code>
          </div>

          <div>
            <p className="text-label text-gray-500 mb-2">HEADING S</p>
            <h4 className="text-heading-s text-gray-900">
              16px / Semi-bold / 1.4 line-height
            </h4>
            <code className="text-code text-gray-500 block mt-2">
              className="text-heading-s"
            </code>
          </div>
        </section>

        {/* Body Text Section */}
        <section className="space-y-6">
          <div>
            <p className="text-label text-gray-500 mb-2">BODY</p>
            <p className="text-body text-gray-900">
              14px / Regular / 1.5 line-height — The quick brown fox jumps over
              the lazy dog. This is the standard body text used throughout the
              application for paragraphs, descriptions, and general content.
            </p>
            <code className="text-code text-gray-500 block mt-2">
              className="text-body"
            </code>
          </div>

          <div>
            <p className="text-label text-gray-500 mb-2">BODY SMALL</p>
            <p className="text-body-small text-gray-600">
              13px / Regular / 1.5 line-height — Used for secondary information,
              captions, or supporting text that needs slightly less emphasis.
            </p>
            <code className="text-code text-gray-500 block mt-2">
              className="text-body-small"
            </code>
          </div>
        </section>

        {/* Labels & UI Text */}
        <section className="space-y-6">
          <div>
            <p className="text-label text-gray-500 mb-2">LABEL</p>
            <p className="text-label text-gray-700">
              Form Label Text
            </p>
            <code className="text-code text-gray-500 block mt-2">
              className="text-label"
            </code>
          </div>

          <div>
            <p className="text-label text-gray-500 mb-2">CODE</p>
            <code className="text-code text-gray-900 bg-gray-100 px-2 py-1 rounded">
              const example = "monospace font";
            </code>
            <code className="text-code text-gray-500 block mt-2">
              className="text-code"
            </code>
          </div>
        </section>

        {/* Interactive Elements */}
        <section className="space-y-6">
          <div>
            <p className="text-label text-gray-500 mb-3">INTERACTIVE TEXT</p>
            <div className="space-y-3">
              <a href="#" className="text-link text-blue-600 hover:text-blue-700 block">
                Link Text (text-link)
              </a>
              <button className="text-button bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Button Text (text-button)
              </button>
              <button className="text-button-small bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300">
                Small Button (text-button-small)
              </button>
            </div>
          </div>
        </section>

        {/* Usage Example */}
        <section className="border-t pt-8">
          <h3 className="text-heading-m text-gray-900 mb-4">
            Real-World Example
          </h3>
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h4 className="text-heading-s text-gray-900">
              Workflow Settings
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-label text-gray-700 block mb-1">
                  WORKFLOW NAME
                </label>
                <p className="text-body text-gray-900">
                  Customer Onboarding Process
                </p>
              </div>
              <div>
                <label className="text-label text-gray-700 block mb-1">
                  DESCRIPTION
                </label>
                <p className="text-body-small text-gray-600">
                  Automated workflow for new customer registration and verification
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
