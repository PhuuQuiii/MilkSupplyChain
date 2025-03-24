const MilkSupplyChain = artifacts.require("MilkSupplyChain");

module.exports = async function (deployer, network, accounts) {
  // Triển khai hợp đồng MilkSupplyChain
  await deployer.deploy(MilkSupplyChain);
  const milkSupplyChain = await MilkSupplyChain.deployed();

  console.log("MilkSupplyChain deployed to:", milkSupplyChain.address);

  // Danh sách các Participant
  const participants = [
    { role: 'ADMIN', name: 'Quản trị', address: '0xf2068df20F5c68600969caFAbA1D8c3345Ca5AFc' },
    { role: 'FARM', name: 'Trang trại', address: '0xB0B3F843829C4D11DD137D3f2304c917CAb36Ea0' },
    { role: 'MANUFACTURER', name: 'Nhà sản xuất', address: '0x7B839817F7D4Ecf64c8884265cDDFE596fEEC143' },
    { role: 'DISTRIBUTOR', name: 'Nhà phân phối', address: '0x34e8001448685EE403EB01929CDd28bb942B276e' },
    { role: 'RETAILER', name: 'Nhà bán lẻ', address: '0xCae730a0f7f9a342A08Ccd2b8AE24Cd4B2EB6621' },
    { role: 'NUTRITION_AUTHORITY', name: 'Viện dinh dưỡng', address: '0x997236D9fFF38E3fB1f9582F51f334480d83247f' },
    { role: 'FOOD_SAFETY_AUTHORITY', name: 'Viện an toàn thực phẩm', address: '0x88627A50D362a98aae536eF1A46628fE801f7725' },
    { role: 'TRANSPORT_AUTHORITY', name: 'Kiểm định vận chuyển', address: '0x7E3bdE965c892B354f98e1EF896304cABBe6511b' },
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