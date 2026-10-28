import { MethodPage } from '../features/method/MethodPage';
import { useLessonNavigation } from '../features/method/useLessonNavigation';
import { useAppUi } from '../shared/state/ui-context';
import { AppDialogs } from './AppDialogs';
import { SiteFooter } from './layout/SiteFooter';
import { SiteHeader } from './layout/SiteHeader';

export function AppShell() {
  const navigation = useLessonNavigation();
  const { pauseOthers } = useAppUi();
  return (
    <>
      <SiteHeader expand={navigation.expand} />
      <MethodPage
        collapsed={navigation.collapsed}
        onExpand={navigation.expand}
        onToggle={navigation.toggle}
        onToggleAll={() => {
          pauseOthers();
          navigation.toggleAll();
        }}
      />
      <SiteFooter />
      <AppDialogs />
    </>
  );
}
