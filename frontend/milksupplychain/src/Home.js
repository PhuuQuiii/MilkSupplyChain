import React from 'react';

function Home() {
  return (
    <div>
        <div>
            <h2>Chuỗi cung ứng sữa của Vinamilk</h2>
            <img
                src={require('./images/supplychain.png')}
                alt="Sơ đồ chuỗi cung ứng"
                style={{ maxWidth: '100%', margin: '1rem 0', width: "800px", height: "300px" }}
            />
        </div>
        <div>
            <h3>1. Trang trại</h3>
            <p>Vinamilk sở hữu hệ thống trang trại bò sữa hiện đại, đạt chuẩn GlobalG.A.P. và Organic, đảm bảo nguồn sữa tươi sạch và chất lượng cao.</p>
            <img
                src={require('./images/farm.png')}
                alt="Trang trại"
                style={{ maxWidth: '100%', margin: '1rem 0', width: "800px", height: "300px" }}
            />
        </div>
        <div>
            <h3>2. Nhà sản xuất</h3>
            <p>Các nhà máy của Vinamilk ứng dụng công nghệ tiên tiến để chế biến sữa tươi thành các sản phẩm như sữa nước, sữa bột, sữa chua và nhiều sản phẩm dinh dưỡng khác.</p>
            <img
                src={require('./images/manufacturer.png')}
                alt="Nhà sản xuất"
                style={{ maxWidth: '100%', margin: '1rem 0', width: "800px", height: "300px" }}
            />
        </div>
        <div>
            <h3>3. Nhà phân phối</h3>
            <p>Hệ thống phân phối của Vinamilk được tối ưu hóa với kho lạnh và phương tiện vận chuyển chuyên dụng, đảm bảo sản phẩm được bảo quản và giao hàng đúng tiêu chuẩn.</p>
            <img
                src={require('./images/distributor.png')}
                alt="Nhà phân phối"
                style={{ maxWidth: '100%', margin: '1rem 0', width: "800px", height: "300px" }}
            />
        </div>
        <div>
            <h3>4. Nhà bán lẻ</h3>
            <p>Sản phẩm Vinamilk được phân phối qua siêu thị, cửa hàng tiện lợi, đại lý sữa và kênh thương mại điện tử, đáp ứng nhu cầu người tiêu dùng</p>
            <img
                src={require('./images/retailer.png')}
                alt="Nhà sản xuất"
                style={{ maxWidth: '100%', margin: '1rem 0', width: "800px", height: "300px" }}
            />
        </div>
      
    </div>
  );
}

export default Home;
