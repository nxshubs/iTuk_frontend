"use client"

import BecomeProviderCard from "./BecomeProviderCard"
import LocationSettingsCard from "./LocationSettingsCard"
import AppearanceSettingsCard from "./AppearanceSettingsCard"
import SecuritySettingsCard from "./SecuritySettingsCard"
import ProviderDashboardLinkCard from "./ProviderDashboardLinkCard"

interface SettingsViewProps {
  onOpenProviderModal: () => void;
  isProvider: boolean;
}

export default function SettingsView({ onOpenProviderModal, isProvider }: SettingsViewProps) {
  return (
    <>
      {isProvider ? (
        <ProviderDashboardLinkCard />
      ) : (
        <BecomeProviderCard onOpenModal={onOpenProviderModal} />
      )}
      {/* <LocationSettingsCard /> */}
      <AppearanceSettingsCard />
      <SecuritySettingsCard />
    </>
  )
}