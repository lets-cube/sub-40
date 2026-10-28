import { useLessonNavigation } from '../features/learn-method/useLessonNavigation';
import { MethodPage } from '../pages/method/MethodPage';
import { useAppUi } from '../shared/state/ui-context';
import { ACTIVE_METHOD } from './active-method';
import { AppDialogs } from './AppDialogs';
import { SiteFooter } from './layout/SiteFooter';
import { SiteHeader } from './layout/SiteHeader';

export function AppShell() {
  const navigation = useLessonNavigation(ACTIVE_METHOD.lessons);
  const { pauseOthers } = useAppUi();
  return (
    <>
      <SiteHeader lessons={ACTIVE_METHOD.lessons} expand={navigation.expand} />
      <MethodPage
        method={ACTIVE_METHOD}
        collapsed={navigation.collapsed}
        onExpand={navigation.expand}
        onToggle={navigation.toggle}
        onToggleAll={() => {
          pauseOthers();
          navigation.toggleAll();
        }}
      />
      <SiteFooter />
      <AppDialogs patterns={ACTIVE_METHOD.patterns} />
    </>
  );
}
