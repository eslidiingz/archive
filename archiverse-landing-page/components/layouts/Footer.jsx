import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Config from "../../configs/config";

const Footer = () => {
  const [sitemap, setSitemap] = useState([]);
  const router = useRouter();

  const fetchFooterSitemap = useCallback(async () => {
    const response = await fetch(
      `${Config.CMS_API}/footer-maps?populate=*&sort=id`
    );
    if (response.status === 200) {
      const { data } = await response.json();
      console.log(
        "🚀 ~ file: Footer.jsx ~ line 14 ~ fetchFooterSitemap ~ data",
        data
      );
      setSitemap(data);
    }
  }, []);

  useEffect(() => {
    fetchFooterSitemap();
  }, [fetchFooterSitemap]);

  return (
    <>
      <div className="footer-main-bg">
        <Container>
          <Row>
            <Col lg={4}>
              <img
                src="/assets/image/archiverse/logo/Logo-ArchiVerse-h-w.svg"
                className="footer-logo-size"
              />
              <h4 className="ci-purplepink fw-bold mt-5">Join the community</h4>
              <div className="d-flex align-items-center">
                <Link href="https://www.facebook.com/SwapleSwaple">
                  <div className="footer-icon-social me-4">
                    <i className="fab fa-facebook icon-footer-facebook fa-2xl"></i>
                  </div>
                </Link>
                <Link href="https://twitter.com/SwapleSwaple?t=ur0jwmqOYsaFU460FZgvwA&s=06">
                  <div className="footer-icon-social">
                    <i className="fab fa-twitter icon-footer-twitter fa-2xl"></i>
                  </div>
                </Link>
              </div>
            </Col>
            <Col lg={8}>
              <Row>
                {sitemap.map((item, index) => {
                  return (
                    <Col lg={4} key={index}>
                      <h4 className="ci-white mb-3">
                        {item?.attributes?.header_text}
                      </h4>
                      <div className="d-flex flex-row flex-wrap flex-lg-column gap-2 gap-lg-0 txt-all-footermenu ps-2">
                        {item?.attributes?.footer_links?.data.map(
                          (sub_item, sub_index) => {
                            return sub_item?.attributes?.coming_soon ===
                              false ? (
                              <Link
                                href={sub_item?.attributes?.link}
                                key={`${index}_${sub_index}`}
                              >
                                <h6 className="footer-txt-link">
                                <i className="fas fa-caret-right me-2"></i>
                                  {sub_item?.attributes?.name}
                                </h6>
                              </Link>
                            ) : (
                              <h6 className="footer-txt-link disable" key={`${index}_${sub_index}`}>
                                <i className="fas fa-caret-right me-2"></i>
                                {sub_item?.attributes?.name}
                              </h6>
                            );
                          }
                        )}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default Footer;
