import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function usePreventLeave(hasChanges: boolean) {
  const location = useLocation();
  const navigate = useNavigate();

  // منع إغلاق المتصفح أو تحديث الصفحة
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = 'لديك تغييرات غير محفوظة. هل تريد المغادرة؟';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanges]);

  // منع التنقل داخل التطبيق (عن طريق الرجوع أو النقر على الروابط)
  useEffect(() => {
    if (!hasChanges) return;

    // دالة التحقق قبل التنقل
    const handleNavigation = () => {
      if (!confirm('لديك تغييرات غير محفوظة. هل تريد المغادرة؟')) {
        // إلغاء التنقل (يتم ذلك عن طريق رمي خطأ للـ Router)
        throw new Error('Navigation cancelled');
      }
    };

    // إضافة مستمع للحدث قبل تغيير المسار
    window.addEventListener('beforeunload', handleNavigation);

    // تنظيف المستمع عند إلغاء التثبيت
    return () => {
      window.removeEventListener('beforeunload', handleNavigation);
    };
  }, [hasChanges, location]);

  // إضافة تنبيه عند محاولة الرجوع باستخدام زر الرجوع في المتصفح
  useEffect(() => {
    if (!hasChanges) return;

    const handlePopState = (e: PopStateEvent) => {
      if (!confirm('لديك تغييرات غير محفوظة. هل تريد المغادرة؟')) {
        // إلغاء الرجوع بإعادة التوجيه إلى المسار الحالي
        navigate(location.pathname, { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasChanges, location, navigate]);
}
