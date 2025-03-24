const MilkSupplyChain = artifacts.require("MilkSupplyChain");

module.exports = async function (deployer, network, accounts) {
  // Triển khai hợp đồng MilkSupplyChain
  await deployer.deploy(MilkSupplyChain);
  const milkSupplyChain = await MilkSupplyChain.deployed();

  console.log("MilkSupplyChain deployed to:", milkSupplyChain.address);

  // Danh sách các Participant
  const participants = [
    { role: 'ADMIN', name: 'Quản trị', address: '0x8B5608591A2360d53b20e26460C59BC8c9f5c974' },
    { role: 'FARM', name: 'Trang trại', address: '0x53fD2C237a18d3A731137E3a90bd41E12B90B173' },
    { role: 'MANUFACTURER', name: 'Nhà sản xuất', address: '0xb80e8874565f88870Ad19EFB5Afa6f2BFe20409c' },
    { role: 'DISTRIBUTOR', name: 'Nhà phân phối', address: '0xe03c2402330fE27f3DFd803B40aD1eA18D313019' },
    { role: 'RETAILER', name: 'Nhà bán lẻ', address: '0xc50562C4c1BdC1F7A5690513427cCd3cde40f043' },
    { role: 'NUTRITION_AUTHORITY', name: 'Viện dinh dưỡng', address: '0xA93Fc57Fe3493a91dC4Efe169C63f06A715b6Ba0' },
    { role: 'FOOD_SAFETY_AUTHORITY', name: 'Viện an toàn thực phẩm', address: '0x701249DB5372577e81A1D701d8EA29A78130D407' },
    { role: 'TRANSPORT_AUTHORITY', name: 'Kiểm định vận chuyển', address: '0xDf0f7DF20c4653B57833A4a20CD683B85584C25a' },
  ];

  // Đăng ký từng Participant
  for (const participant of participants) {
    await milkSupplyChain.setParticipant(
      participant.address,
      participant.name,
      "Số 10, Đường Tân Trào, phường Tân Phú, quận 7, Tp. HCM", // Địa chỉ
      "(028) 54 161 226", // Số điện thoại
      participant.role,
      true // isActive
    );

    console.log(`Participant ${participant.name} (${participant.role}) registered successfully!`);
  }

  console.log("All participants registered!");
};