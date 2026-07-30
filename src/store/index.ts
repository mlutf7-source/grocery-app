import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const gid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

const now = () => new Date().toISOString();

const today = () => new Date().toISOString().split('T')[0];

const defaultBox = {
  id: 'default-cash-box',
  name: 'الصندوق الرئيسي',
  balance: 0,
  createdAt: now(),
  updatedAt: now(),
};

const defaultSettings = {
  currency: 'ريال يمني',
};

export const useStore = create<any>()(
  persist(
    (set, get) => ({
      products: [],
      customers: [],
      suppliers: [],

      cashBoxes: [defaultBox],

      cashMovements: [],
      sales: [],
      purchases: [],
      expenses: [],

      activityLogs: [],

      settings: defaultSettings,

      trash: {
        products: [],
        customers: [],
        suppliers: [],
        cashBoxes: [],
        sales: [],
        purchases: [],
        expenses: [],
        cashMovements: [],
      },


      // ===============================
      // سجل العمليات
      // ===============================

      addActivityLog: (log: any) =>
        set((s: any) => ({
          activityLogs: [
            ...s.activityLogs,
            {
              id: gid(),
              createdAt: now(),
              ...log,
            },
          ],
        })),


      // ===============================
      // نقل إلى سلة المحذوفات
      // ===============================

      moveToTrash: (col: string, id: string) =>
        set((s: any) => {

          const item = s[col]?.find(
            (x: any) => x.id === id
          );

          if (!item) return s;

          return {
            [col]: s[col].filter(
              (x: any) => x.id !== id
            ),

            trash: {
              ...s.trash,

              [col]: [
                ...s.trash[col],
                {
                  ...item,
                  deletedAt: now(),
                },
              ],
            },

            activityLogs: [
              ...s.activityLogs,
              {
                id: gid(),
                action: 'delete',
                type: col,
                referenceId: id,
                description: `حذف ${col}`,
                createdAt: now(),
              },
            ],
          };
        }),



      // ===============================
      // استرجاع من السلة
      // ===============================

      restoreFromTrash: (col: string, id: string) =>
        set((s: any) => {

          const item = s.trash[col]?.find(
            (x: any) => x.id === id
          );

          if (!item) return s;


          const restored = {
            ...item,
          };

          delete restored.deletedAt;


          return {

            trash: {
              ...s.trash,

              [col]:
                s.trash[col].filter(
                  (x: any) => x.id !== id
                ),
            },


            [col]: [
              ...s[col],
              restored,
            ],


            activityLogs: [
              ...s.activityLogs,

              {
                id: gid(),

                action: 'restore',

                type: col,

                referenceId: id,

                description:
                  `استرجاع ${col}`,

                createdAt: now(),
              },
            ],

          };

        }),



      // ===============================
      // حذف نهائي
      // ===============================

      permanentDelete:
        (col: string, id: string) =>
        set((s: any) => ({

          trash: {

            ...s.trash,

            [col]:
              s.trash[col].filter(
                (x: any) => x.id !== id
              ),

          },


          activityLogs: [
            ...s.activityLogs,

            {
              id: gid(),

              action: 'permanent-delete',

              type: col,

              referenceId: id,

              description:
                `حذف نهائي ${col}`,

              createdAt: now(),
            },

          ],

        })),


      // ===============================
      // المنتجات
      // ===============================

      addProduct: (p: any) => {
        const exists = get().products.find(
          (x: any) => x.name === p.name
        );

        if (exists) return;

        set((s: any) => ({
          products: [
            ...s.products,
            {
              ...p,
              id: gid(),
              createdAt: p.createdAt || now(),
              updatedAt: now(),
            },
          ],
        }));
      },


      updateProduct: (id: string, data: any) =>
        set((s: any) => ({
          products: s.products.map(
            (p: any) =>
              p.id === id
                ? {
                    ...p,
                    ...data,
                    updatedAt: now(),
                  }
                : p
          ),
        })),


      deleteProduct: (id: string) =>
        get().moveToTrash('products', id),


      restoreProduct: (id: string) =>
        get().restoreFromTrash('products', id),


      permanentDeleteProduct: (id: string) =>
        get().permanentDelete('products', id),



      // ===============================
      // العملاء
      // ===============================

      addCustomer: (c: any) => {

        const exists = get().customers.find(
          (x: any) => x.name === c.name
        );

        if (exists) return;


        set((s: any) => ({
          customers: [
            ...s.customers,

            {
              ...c,
              id: gid(),
              balance: c.balance || 0,
              createdAt: c.createdAt || now(),
              updatedAt: now(),
            },

          ],
        }));
      },


      updateCustomer: (id: string, data: any) =>
        set((s: any) => ({
          customers:
            s.customers.map((c: any) =>
              c.id === id
                ? {
                    ...c,
                    ...data,
                    updatedAt: now(),
                  }
                : c
            ),
        })),


      deleteCustomer: (id: string) => {
        // التحقق من وجود فواتير أو حركات مالية مرتبطة
        const hasSales = get().sales.some((s: any) => s.customerId === id);
        const hasMovements = get().cashMovements.some((m: any) => m.referenceId === id);
        
        if (hasSales || hasMovements) {
          alert('لا يمكن حذف هذا العميل لأنه لديه عمليات سابقة.');
          return;
        }
        get().moveToTrash('customers', id);
      },


      restoreCustomer: (id: string) =>
        get().restoreFromTrash('customers', id),


      permanentDeleteCustomer: (id: string) =>
        get().permanentDelete('customers', id),




      // ===============================
      // الموردين
      // ===============================

      addSupplier: (sup: any) => {

        const exists = get().suppliers.find(
          (x: any) => x.name === sup.name
        );

        if (exists) return;


        set((s: any) => ({

          suppliers: [

            ...s.suppliers,

            {
              ...sup,

              id: gid(),

              balance:
                sup.balance || 0,

              createdAt:
                sup.createdAt || now(),

              updatedAt: now(),

            },

          ],

        }));
      },


      updateSupplier: (id: string, data: any) =>
        set((s: any) => ({

          suppliers:

            s.suppliers.map((sup: any) =>

              sup.id === id

                ? {
                    ...sup,
                    ...data,
                    updatedAt: now(),
                  }

                : sup

            ),

        })),



      deleteSupplier: (id: string) => {
        // التحقق من وجود مشتريات أو حركات مالية مرتبطة
        const hasPurchases = get().purchases.some((p: any) => p.supplierId === id);
        const hasMovements = get().cashMovements.some((m: any) => m.referenceId === id);
        
        if (hasPurchases || hasMovements) {
          alert('لا يمكن حذف هذا المورد لأنه لديه عمليات سابقة.');
          return;
        }
        get().moveToTrash('suppliers', id);
      },


      restoreSupplier: (id: string) =>
        get().restoreFromTrash('suppliers', id),


      permanentDeleteSupplier: (id: string) =>
        get().permanentDelete('suppliers', id),




      // ===============================
      // الصناديق
      // ===============================

      addCashBox: (box: any) =>
        set((s: any) => ({
          cashBoxes: [
            ...s.cashBoxes,

            {
              ...box,

              id: gid(),

              balance:
                box.balance || 0,

              createdAt:
                now(),

              updatedAt:
                now(),
            },
          ],
        })),



      updateCashBox: (id: string, data: any) =>
        set((s: any) => ({
          cashBoxes:

            s.cashBoxes.map((b: any) =>

              b.id === id

                ? {
                    ...b,
                    ...data,
                    updatedAt: now(),
                  }

                : b

            ),
        })),



      deleteCashBox: (id: string) => {

        if (id === 'default-cash-box')
          return;

        // التحقق من وجود حركات مالية مرتبطة
        const hasMovements = get().cashMovements.some((m: any) => m.cashBoxId === id);
        
        if (hasMovements) {
          alert('لا يمكن حذف هذا الصندوق لأنه لديه حركات مالية سابقة.');
          return;
        }

        get().moveToTrash(
          'cashBoxes',
          id
        );
      },


      restoreCashBox: (id: string) =>
        get().restoreFromTrash(
          'cashBoxes',
          id
        ),


      permanentDeleteCashBox: (id: string) =>
        get().permanentDelete(
          'cashBoxes',
          id
        ),

    }),

    {
      name: 'grocery-store'
    }

  )
);
