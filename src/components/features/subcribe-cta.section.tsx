import DownloadButton from "../common/buttons/download.button";

export default function SubscribeCTASection() {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="py-10 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 md:p-12 shadow-lg border border-blue-100 dark:border-slate-700">
        <div className="px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Center: Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Tải ứng dụng{" "}
              <span className="text-primary dark:text-primary">IT-Job</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tìm việc mọi lúc, mọi nơi với ứng dụng di động của chúng tôi
            </p>
          </div>

          {/* Right: Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <DownloadButton type="ggplay"/>
            <DownloadButton type="appstore"/>
          </div>
        </div>
      </div>
    </div>
  );
}

