export default function generateServiceRequestLink(serviceType, packageType) {
  const params = new URLSearchParams();

  params.set("service", serviceType);

  if (packageType) {
    params.set("package", packageType.toLowerCase().replaceAll(" ", "-"));
  }

  return `/service-request?${params.toString()}`;
}
