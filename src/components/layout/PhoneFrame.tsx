import { Outlet } from 'react-router-dom';

export default function PhoneFrame() {
  return (
    <div className="relative mx-auto" style={{ width: 390, height: 844 }}>
      {/* Phone body */}
      <div className="absolute inset-0 bg-black rounded-[3rem] shadow-2xl border-[3px] border-gray-800">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-2xl z-20" />

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-[50px] flex items-end justify-between px-8 pb-1 z-10">
          <span className="text-white text-xs font-semibold">9:41</span>
          <div className="flex items-center gap-1">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
              <rect x="0" y="8" width="3" height="4" rx="0.5" />
              <rect x="4" y="5" width="3" height="7" rx="0.5" />
              <rect x="8" y="2" width="3" height="10" rx="0.5" />
              <rect x="12" y="0" width="3" height="12" rx="0.5" />
            </svg>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
              <path d="M7.5 3.5C9.2 3.5 10.7 4.2 11.8 5.3L13.2 3.9C11.7 2.4 9.7 1.5 7.5 1.5C5.3 1.5 3.3 2.4 1.8 3.9L3.2 5.3C4.3 4.2 5.8 3.5 7.5 3.5Z" />
              <path d="M7.5 6.5C8.6 6.5 9.5 6.9 10.2 7.6L11.6 6.2C10.5 5.1 9.1 4.5 7.5 4.5C5.9 4.5 4.5 5.1 3.4 6.2L4.8 7.6C5.5 6.9 6.4 6.5 7.5 6.5Z" />
              <circle cx="7.5" cy="10" r="1.5" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="2" stroke="white" strokeWidth="1" />
              <rect x="22" y="3.5" width="2.5" height="5" rx="1" fill="white" />
              <rect x="2" y="2" width="14" height="8" rx="1" fill="white" />
            </svg>
          </div>
        </div>

        {/* Screen area */}
        <div className="absolute top-[14px] left-[3px] right-[3px] bottom-[14px] bg-white rounded-[2.6rem] overflow-hidden">
          <div className="h-full overflow-y-auto pt-[36px]">
            <Outlet />
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white rounded-full" />
      </div>
    </div>
  );
}
