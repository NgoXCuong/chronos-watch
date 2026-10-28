import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import AccountLayout from "@/components/client/AccountLayout";
import AccountSummary from "@/components/client/profile/AccountSummary";
import AddressTab from "./AddressTab";
import ChangePasswordTab from "./ChangePasswordTab";
import ProfileInfoTab from "./ProfileInfoTab";
import { profileTabMeta } from "@/constants/accountNav";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

// Hash → tab. Đơn hàng và yêu thích đã chuyển sang trang riêng (/orders, /wishlist),
// nên /orders/:id và /wishlist là đường vào duy nhất — không còn tab trùng.
const TAB_COMPONENTS = {
  "": ProfileInfoTab,
  "#addresses": AddressTab,
  "#security": ChangePasswordTab,
};

const AdminLink = () => (
  <Link to="/admin" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}>
    <LayoutDashboard size={14} strokeWidth={2} aria-hidden="true" />
    Trang quản trị
  </Link>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const hash = TAB_COMPONENTS[location.hash] ? location.hash : "";
  const Tab = TAB_COMPONENTS[hash];
  const meta = profileTabMeta(hash);

  return (
    <AccountLayout
      title={meta.title}
      subtitle={meta.subtitle}
      actions={
        <div className="flex flex-wrap items-center justify-end gap-3 print:hidden">
          <AccountSummary user={user} />
          {user?.role === "admin" && <AdminLink />}
        </div>
      }
    >
      <Tab />
    </AccountLayout>
  );
};

export default ProfilePage;
