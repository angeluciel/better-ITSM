import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRedirectStore } from "../../lib/redirect-store";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const consumeNext = useRedirectStore((s) => s.consumeNext);

  async function handleLogin() {
    // TODO: real auth here
    const next = consumeNext() ?? "/dashboard";
    navigate({ to: next });
  }

  return (
    <div className="min-w-screen flex flex-col bg-neutral-100 dark:bg-darkNeutral-100">
      <div className="flex max-w-full h-fit overflow-x-hidden">
        <div className="red flex flex-col w-full">
          <div className="bg-red-50 py-4 flex justify-center items-center">
            <span>red-50</span>
          </div>
          <div className="bg-red-100 py-4 flex justify-center items-center">
            <span>red-100</span>
          </div>
          <div className="bg-red-200 py-4 flex justify-center items-center">
            <span>red-200</span>
          </div>
          <div className="bg-red-300 py-4 flex justify-center items-center">
            <span>red-300</span>
          </div>
          <div className="bg-red-400 py-4 flex justify-center items-center">
            <span>red-400</span>
          </div>
          <div className="bg-red-500 py-4 flex justify-center items-center">
            <span>red-500</span>
          </div>
          <div className="bg-red-600 py-4 flex justify-center items-center">
            <span className="text-white">red-600</span>
          </div>
          <div className="bg-red-700 py-4 flex justify-center items-center">
            <span className="text-white">red-700</span>
          </div>
          <div className="bg-red-800 py-4 flex justify-center items-center">
            <span className="text-white">red-800</span>
          </div>
          <div className="bg-red-900 py-4 flex justify-center items-center">
            <span className="text-white">red-900</span>
          </div>
          <div className="bg-red-950 py-4 flex justify-center items-center">
            <span className="text-white">red-950</span>
          </div>
          <div className="bg-red-1000 py-4 flex justify-center items-center">
            <span className="text-white">red-1000</span>
          </div>
        </div>
        <div className="yellow flex flex-col w-full">
          <div className="bg-yellow-50 py-4 flex justify-center items-center">
            <span>yellow-50</span>
          </div>
          <div className="bg-yellow-100 py-4 flex justify-center items-center">
            <span>yellow-100</span>
          </div>
          <div className="bg-yellow-200 py-4 flex justify-center items-center">
            <span>yellow-200</span>
          </div>
          <div className="bg-yellow-300 py-4 flex justify-center items-center">
            <span>yellow-300</span>
          </div>
          <div className="bg-yellow-400 py-4 flex justify-center items-center">
            <span>yellow-400</span>
          </div>
          <div className="bg-yellow-500 py-4 flex justify-center items-center">
            <span>yellow-500</span>
          </div>
          <div className="bg-yellow-600 py-4 flex justify-center items-center">
            <span className="text-white">yellow-600</span>
          </div>
          <div className="bg-yellow-700 py-4 flex justify-center items-center">
            <span className="text-white">yellow-700</span>
          </div>
          <div className="bg-yellow-800 py-4 flex justify-center items-center">
            <span className="text-white">yellow-800</span>
          </div>
          <div className="bg-yellow-900 py-4 flex justify-center items-center">
            <span className="text-white">yellow-900</span>
          </div>
          <div className="bg-yellow-950 py-4 flex justify-center items-center">
            <span className="text-white">yellow-950</span>
          </div>
          <div className="bg-yellow-1000 py-4 flex justify-center items-center">
            <span className="text-white">yellow-1000</span>
          </div>
        </div>
        <div className="green flex flex-col w-full">
          <div className="bg-green-50 py-4 flex justify-center items-center">
            <span>green-50</span>
          </div>
          <div className="bg-green-100 py-4 flex justify-center items-center">
            <span>green-100</span>
          </div>
          <div className="bg-green-200 py-4 flex justify-center items-center">
            <span>green-200</span>
          </div>
          <div className="bg-green-300 py-4 flex justify-center items-center">
            <span>green-300</span>
          </div>
          <div className="bg-green-400 py-4 flex justify-center items-center">
            <span>green-400</span>
          </div>
          <div className="bg-green-500 py-4 flex justify-center items-center">
            <span>green-500</span>
          </div>
          <div className="bg-green-600 py-4 flex justify-center items-center">
            <span className="text-white">green-600</span>
          </div>
          <div className="bg-green-700 py-4 flex justify-center items-center">
            <span className="text-white">green-700</span>
          </div>
          <div className="bg-green-800 py-4 flex justify-center items-center">
            <span className="text-white">green-800</span>
          </div>
          <div className="bg-green-900 py-4 flex justify-center items-center">
            <span className="text-white">green-900</span>
          </div>
          <div className="bg-green-950 py-4 flex justify-center items-center">
            <span className="text-white">green-950</span>
          </div>
          <div className="bg-green-1000 py-4 flex justify-center items-center">
            <span className="text-white">green-1000</span>
          </div>
        </div>
        <div className="blue flex flex-col w-full">
          <div className="bg-blue-50 py-4 flex justify-center items-center">
            <span>blue-50</span>
          </div>
          <div className="bg-blue-100 py-4 flex justify-center items-center">
            <span>blue-100</span>
          </div>
          <div className="bg-blue-200 py-4 flex justify-center items-center">
            <span>blue-200</span>
          </div>
          <div className="bg-blue-300 py-4 flex justify-center items-center">
            <span>blue-300</span>
          </div>
          <div className="bg-blue-400 py-4 flex justify-center items-center">
            <span>blue-400</span>
          </div>
          <div className="bg-blue-500 py-4 flex justify-center items-center">
            <span>blue-500</span>
          </div>
          <div className="bg-blue-600 py-4 flex justify-center items-center">
            <span className="text-white">blue-600</span>
          </div>
          <div className="bg-blue-700 py-4 flex justify-center items-center">
            <span className="text-white">blue-700</span>
          </div>
          <div className="bg-blue-800 py-4 flex justify-center items-center">
            <span className="text-white">blue-800</span>
          </div>
          <div className="bg-blue-900 py-4 flex justify-center items-center">
            <span className="text-white">blue-900</span>
          </div>
          <div className="bg-blue-950 py-4 flex justify-center items-center">
            <span className="text-white">blue-950</span>
          </div>
          <div className="bg-blue-1000 py-4 flex justify-center items-center">
            <span className="text-white">blue-1000</span>
          </div>
        </div>
        <div className="purple flex flex-col w-full">
          <div className="bg-purple-50 py-4 flex justify-center items-center">
            <span>purple-50</span>
          </div>
          <div className="bg-purple-100 py-4 flex justify-center items-center">
            <span>purple-100</span>
          </div>
          <div className="bg-purple-200 py-4 flex justify-center items-center">
            <span>purple-200</span>
          </div>
          <div className="bg-purple-300 py-4 flex justify-center items-center">
            <span>purple-300</span>
          </div>
          <div className="bg-purple-400 py-4 flex justify-center items-center">
            <span>purple-400</span>
          </div>
          <div className="bg-purple-500 py-4 flex justify-center items-center">
            <span>purple-500</span>
          </div>
          <div className="bg-purple-600 py-4 flex justify-center items-center">
            <span className="text-white">purple-600</span>
          </div>
          <div className="bg-purple-700 py-4 flex justify-center items-center">
            <span className="text-white">purple-700</span>
          </div>
          <div className="bg-purple-800 py-4 flex justify-center items-center">
            <span className="text-white">purple-800</span>
          </div>
          <div className="bg-purple-900 py-4 flex justify-center items-center">
            <span className="text-white">purple-900</span>
          </div>
          <div className="bg-purple-950 py-4 flex justify-center items-center">
            <span className="text-white">purple-950</span>
          </div>
          <div className="bg-purple-1000 py-4 flex justify-center items-center">
            <span className="text-white">purple-1000</span>
          </div>
        </div>
        <div className="pink flex flex-col w-full">
          <div className="bg-pink-50 py-4 flex justify-center items-center">
            <span>pink-50</span>
          </div>
          <div className="bg-pink-100 py-4 flex justify-center items-center">
            <span>pink-100</span>
          </div>
          <div className="bg-pink-200 py-4 flex justify-center items-center">
            <span>pink-200</span>
          </div>
          <div className="bg-pink-300 py-4 flex justify-center items-center">
            <span>pink-300</span>
          </div>
          <div className="bg-pink-400 py-4 flex justify-center items-center">
            <span>pink-400</span>
          </div>
          <div className="bg-pink-500 py-4 flex justify-center items-center">
            <span>pink-500</span>
          </div>
          <div className="bg-pink-600 py-4 flex justify-center items-center">
            <span className="text-white">pink-600</span>
          </div>
          <div className="bg-pink-700 py-4 flex justify-center items-center">
            <span className="text-white">pink-700</span>
          </div>
          <div className="bg-pink-800 py-4 flex justify-center items-center">
            <span className="text-white">pink-800</span>
          </div>
          <div className="bg-pink-900 py-4 flex justify-center items-center">
            <span className="text-white">pink-900</span>
          </div>
          <div className="bg-pink-950 py-4 flex justify-center items-center">
            <span className="text-white">pink-950</span>
          </div>
          <div className="bg-pink-1000 py-4 flex justify-center items-center">
            <span className="text-white">pink-1000</span>
          </div>
        </div>
        <div className="orange flex flex-col w-full">
          <div className="bg-orange-50 py-4 flex justify-center items-center">
            <span>orange-50</span>
          </div>
          <div className="bg-orange-100 py-4 flex justify-center items-center">
            <span>orange-100</span>
          </div>
          <div className="bg-orange-200 py-4 flex justify-center items-center">
            <span>orange-200</span>
          </div>
          <div className="bg-orange-300 py-4 flex justify-center items-center">
            <span>orange-300</span>
          </div>
          <div className="bg-orange-400 py-4 flex justify-center items-center">
            <span>orange-400</span>
          </div>
          <div className="bg-orange-500 py-4 flex justify-center items-center">
            <span>orange-500</span>
          </div>
          <div className="bg-orange-600 py-4 flex justify-center items-center">
            <span className="text-white">orange-600</span>
          </div>
          <div className="bg-orange-700 py-4 flex justify-center items-center">
            <span className="text-white">orange-700</span>
          </div>
          <div className="bg-orange-800 py-4 flex justify-center items-center">
            <span className="text-white">orange-800</span>
          </div>
          <div className="bg-orange-900 py-4 flex justify-center items-center">
            <span className="text-white">orange-900</span>
          </div>
          <div className="bg-orange-950 py-4 flex justify-center items-center">
            <span className="text-white">orange-950</span>
          </div>
          <div className="bg-orange-1000 py-4 flex justify-center items-center">
            <span className="text-white">orange-1000</span>
          </div>
        </div>
        <div className="emerald flex flex-col w-full">
          <div className="bg-emerald-50 py-4 flex justify-center items-center">
            <span>emerald-50</span>
          </div>
          <div className="bg-emerald-100 py-4 flex justify-center items-center">
            <span>emerald-100</span>
          </div>
          <div className="bg-emerald-200 py-4 flex justify-center items-center">
            <span>emerald-200</span>
          </div>
          <div className="bg-emerald-300 py-4 flex justify-center items-center">
            <span>emerald-300</span>
          </div>
          <div className="bg-emerald-400 py-4 flex justify-center items-center">
            <span>emerald-400</span>
          </div>
          <div className="bg-emerald-500 py-4 flex justify-center items-center">
            <span>emerald-500</span>
          </div>
          <div className="bg-emerald-600 py-4 flex justify-center items-center">
            <span className="text-white">emerald-600</span>
          </div>
          <div className="bg-emerald-700 py-4 flex justify-center items-center">
            <span className="text-white">emerald-700</span>
          </div>
          <div className="bg-emerald-800 py-4 flex justify-center items-center">
            <span className="text-white">emerald-800</span>
          </div>
          <div className="bg-emerald-900 py-4 flex justify-center items-center">
            <span className="text-white">emerald-900</span>
          </div>
          <div className="bg-emerald-950 py-4 flex justify-center items-center">
            <span className="text-white">emerald-950</span>
          </div>
          <div className="bg-emerald-1000 py-4 flex justify-center items-center">
            <span className="text-white">emerald-1000</span>
          </div>
        </div>
        <div className="teal flex flex-col w-full">
          <div className="bg-teal-50 py-4 flex justify-center items-center">
            <span>teal-50</span>
          </div>
          <div className="bg-teal-100 py-4 flex justify-center items-center">
            <span>teal-100</span>
          </div>
          <div className="bg-teal-200 py-4 flex justify-center items-center">
            <span>teal-200</span>
          </div>
          <div className="bg-teal-300 py-4 flex justify-center items-center">
            <span>teal-300</span>
          </div>
          <div className="bg-teal-400 py-4 flex justify-center items-center">
            <span>teal-400</span>
          </div>
          <div className="bg-teal-500 py-4 flex justify-center items-center">
            <span>teal-500</span>
          </div>
          <div className="bg-teal-600 py-4 flex justify-center items-center">
            <span className="text-white">teal-600</span>
          </div>
          <div className="bg-teal-700 py-4 flex justify-center items-center">
            <span className="text-white">color-teal-700</span>
          </div>
          <div className="bg-teal-800 py-4 flex justify-center items-center">
            <span className="text-white">color-teal-800</span>
          </div>
          <div className="bg-teal-900 py-4 flex justify-center items-center">
            <span className="text-white">color-teal-900</span>
          </div>
          <div className="bg-teal-950 py-4 flex justify-center items-center">
            <span className="text-white">color-teal-950</span>
          </div>
          <div className="bg-teal-1000 py-4 flex justify-center items-center">
            <span className="text-white">color-teal-1000</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full px-12 py-4 gap-10">
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-lg font-semibold text-neutral-1200 dark:text-darkNeutral-1200">
            Light mode neutrals
          </h1>
          <div className="flex gap-20 bg-neutral-0 w-full rounded-lg p-4">
            <div className="flex flex-col gap-2">
              <h2 className="font-medium">Solid</h2>
              <div className="flex flex-col h-fit rounded-sm overflow-hidden">
                <div className="w-40 py-1 px-2 bg-neutral-0 text-neutral-1200">
                  neutral-0
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-50 text-neutral-1200">
                  neutral-50
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-100 text-neutral-1200">
                  neutral-100
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-200 text-neutral-1200">
                  neutral-200
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-300 text-neutral-1200">
                  neutral-300
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-400 text-neutral-1200">
                  neutral-400
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-500 text-neutral-1200">
                  neutral-500
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-600 text-neutral-1200">
                  neutral-600
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-700 text-neutral-0">
                  neutral-700
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-800 text-neutral-0">
                  neutral-800
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-900 text-neutral-0">
                  neutral-900
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-950 text-neutral-0">
                  neutral-950
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-1000 text-neutral-0">
                  neutral-1000
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-1100 text-neutral-0">
                  neutral-1100
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-1200 text-neutral-0">
                  neutral-1200
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-medium">Alpha</h2>
              <div className="flex flex-col h-fit rounded-sm overflow-hidden">
                <div className="w-40 py-1 px-2 bg-neutral-100A">
                  neutral-100A
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-200A">
                  neutral-200A
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-300A">
                  neutral-300A
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-400A">
                  neutral-400A
                </div>
                <div className="w-40 py-1 px-2 bg-neutral-500A">
                  neutral-500A
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-lg font-semibold text-neutral-1200 dark:text-darkNeutral-1200">
            Dark mode neutrals
          </h1>
          <div className="bg-darkNeutral-0 flex gap-20 w-full rounded-lg p-4 text-darkNeutral-1200">
            <div className="flex flex-col gap-2">
              <h2 className="font-medium">Solid</h2>
              <div className="flex flex-col h-fit rounded-sm overflow-hidden">
                <div className="w-40 py-1 px-2 bg-darkNeutral--100 text-darkNeutral-1200">
                  darkNeutral--100
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-0 text-darkNeutral-1200">
                  darkNeutral-0
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-50 text-darkNeutral-1200">
                  darkNeutral-50
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-100 text-darkNeutral-1200">
                  darkNeutral-100
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-150 text-darkNeutral-1200">
                  darkNeutral-150
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-200 text-darkNeutral-1200">
                  darkNeutral-200
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-300 text-darkNeutral-1200">
                  darkNeutral-300
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-400 text-darkNeutral-1200">
                  darkNeutral-400
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-500 text-darkNeutral-1200">
                  darkNeutral-500
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-600 text-darkNeutral-1200">
                  darkNeutral-600
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-700 text-darkNeutral-1200">
                  darkNeutral-700
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-800 text-darkNeutral--100">
                  darkNeutral-800
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-900 text-darkNeutral--100">
                  darkNeutral-900
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-1000 text-darkNeutral--100">
                  darkNeutral-1000
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-1100 text-darkNeutral--100">
                  darkNeutral-1100
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-1200 text-darkNeutral--100">
                  darkNeutral-1200
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-medium">Alpha</h2>
              <div className="flex flex-col h-fit rounded-sm overflow-hidden">
                <div className="w-40 py-1 px-2 bg-darkNeutral--100A">
                  darkNeutral--100A
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-0A">
                  darkNeutral-0A
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-50A">
                  darkNeutral-50A
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-100A">
                  darkNeutral-100A
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-150A">
                  darkNeutral-150A
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-200A">
                  darkNeutral-200A
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-300A">
                  darkNeutral-300A
                </div>
                <div className="w-40 py-1 px-2 bg-darkNeutral-400A">
                  darkNeutral-400A
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
